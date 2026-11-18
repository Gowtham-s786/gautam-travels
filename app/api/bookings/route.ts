import { NextResponse } from "next/server";
import { bookingSchema } from "@/lib/validation";
import { bookingStore, createReference } from "@/lib/store";
import { getTrip } from "@/lib/data";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parsed = bookingSchema.safeParse({ ...payload, travellerCount: Number(payload.travellerCount) });
    if (!parsed.success) return NextResponse.json({ error: "Please complete all booking details." }, { status: 400 });

    const supabase = await createSupabaseServerClient();
    if (supabase) {
      const { data, error } = await supabase.rpc("create_booking_hold", {
        p_departure_id: parsed.data.departureId,
        p_travellers: parsed.data.travellerCount,
        p_pickup_point: parsed.data.pickupPoint,
        p_customer_name: parsed.data.customer.name,
        p_customer_email: parsed.data.customer.email,
        p_customer_phone: parsed.data.customer.phone,
        p_coupon_code: parsed.data.coupon ?? null,
      });
      if (error) {
        const status = /not enough seats|unavailable|expired|limit|minimum/i.test(error.message) ? 409 : 400;
        return NextResponse.json({ error: status === 409 ? "That departure or coupon is no longer available. Please refresh and try again." : "We could not create this booking. Please check your details." }, { status });
      }
      return NextResponse.json({ ...data, mode: "supabase_hold" }, { status: 201 });
    }

    const trip = getTrip(parsed.data.tripSlug);
    const departure = trip?.departures.find((item) => item.id === parsed.data.departureId);
    if (!trip || !departure) return NextResponse.json({ error: "That departure is no longer available." }, { status: 404 });
    const remaining = departure.seatsTotal - departure.seatsBooked - bookingStore.filter((booking) => booking.departureId === departure.id && booking.status === "pending").reduce((sum, booking) => sum + booking.travellerCount, 0);
    if (remaining < parsed.data.travellerCount) return NextResponse.json({ error: "There are not enough seats left for this departure." }, { status: 409 });
    const subtotal = departure.price * parsed.data.travellerCount;
    const discount = parsed.data.coupon?.toUpperCase() === "GOFURTHER" ? Math.min(750, Math.round(subtotal * 0.1)) : 0;
    const booking = { reference: createReference(), tripSlug: trip.slug, departureId: departure.id, travellerCount: parsed.data.travellerCount, pickupPoint: parsed.data.pickupPoint, customer: parsed.data.customer, subtotal, discount, total: subtotal - discount, status: "pending" as const, paymentStatus: "unpaid" as const, createdAt: new Date().toISOString() };
    bookingStore.push(booking);
    return NextResponse.json({ reference: booking.reference, status: booking.status, total: booking.total, mode: "development" }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unable to create booking." }, { status: 500 });
  }
}

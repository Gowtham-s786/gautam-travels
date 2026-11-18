import { NextResponse } from "next/server";
import { z } from "zod";
import { getTrip } from "@/lib/data";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const schema = z.object({ tripSlug: z.string().min(1), departureId: z.string().min(1), travellerCount: z.number().int().min(1).max(12), couponCode: z.string().min(1).max(24) });

export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Enter a coupon code and traveller count." }, { status: 400 });
    const supabase = await createSupabaseServerClient();
    if (supabase) {
      const { data, error } = await supabase.rpc("validate_booking_coupon", {
        p_departure_id: parsed.data.departureId,
        p_travellers: parsed.data.travellerCount,
        p_coupon_code: parsed.data.couponCode,
      });
      if (error) return NextResponse.json({ error: "Coupon validation is temporarily unavailable." }, { status: 503 });
      const result = data as { valid: boolean; discount_inr?: number; message?: string };
      return NextResponse.json({ valid: result.valid, discount: result.discount_inr ?? 0, message: result.message });
    }
    const trip = getTrip(parsed.data.tripSlug);
    const departure = trip?.departures.find((item) => item.id === parsed.data.departureId);
    if (parsed.data.couponCode.toUpperCase() !== "GOFURTHER" || !departure) {
      return NextResponse.json({ valid: false, message: "Coupon is invalid or expired." });
    }
    const subtotal = departure.price * parsed.data.travellerCount;
    return NextResponse.json({ valid: true, discount: Math.min(750, Math.round(subtotal * 0.1)) });
  } catch {
    return NextResponse.json({ error: "Coupon validation failed." }, { status: 500 });
  }
}

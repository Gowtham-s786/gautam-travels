import { NextResponse } from "next/server";
import { enquirySchema } from "@/lib/validation";
import { enquiryStore } from "@/lib/store";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parsed = enquirySchema.safeParse({ ...payload, travellers: payload.travellers ? Number(payload.travellers) : undefined });
    if (!parsed.success) return NextResponse.json({ error: "Please provide a name, valid email, phone number and message." }, { status: 400 });
    const supabase = await createSupabaseServerClient();
    if (supabase) {
      let tripId: string | null = null;
      if (parsed.data.tripSlug) {
        const { data: trip, error: tripError } = await supabase.from("trips").select("id").eq("slug", parsed.data.tripSlug).maybeSingle();
        if (tripError) return NextResponse.json({ error: "Unable to validate the selected trip." }, { status: 400 });
        tripId = trip?.id ?? null;
      }
      const { data: enquiry, error } = await supabase.from("enquiries").insert({
        name: parsed.data.name, email: parsed.data.email, phone: parsed.data.phone,
        trip_id: tripId, travellers: parsed.data.travellers ?? null,
        preferred_date: parsed.data.preferredDate || null, message: parsed.data.message,
      }).select("id").single();
      if (error) return NextResponse.json({ error: "Unable to save your enquiry right now." }, { status: 503 });
      return NextResponse.json({ id: enquiry.id, message: "Enquiry received" }, { status: 201 });
    }
    const enquiry = { id: `ENQ-${Date.now()}`, ...parsed.data, status: "new" as const, createdAt: new Date().toISOString() };
    enquiryStore.push(enquiry);
    return NextResponse.json({ id: enquiry.id, message: "Enquiry received" }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unable to submit enquiry." }, { status: 500 });
  }
}

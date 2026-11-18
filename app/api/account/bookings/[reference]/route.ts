import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(_request: Request, { params }: { params: Promise<{ reference: string }> }) {
  const { reference } = await params;
  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Account service is not configured." }, { status: 503 });
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) return NextResponse.json({ error: "Sign in to view this booking." }, { status: 401 });
  const { data, error } = await supabase.from("bookings")
    .select("id,reference,traveller_count,total_inr,subtotal_inr,discount_inr,status,created_at,hold_expires_at,departures(starts_on,ends_on,trips(title,slug,destination)),pickup_points(name),payments(status,provider,amount_inr,created_at)")
    .eq("reference", reference).maybeSingle();
  if (error) return NextResponse.json({ error: "Unable to load this booking." }, { status: 503 });
  if (!data) return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  return NextResponse.json({ booking: data });
}

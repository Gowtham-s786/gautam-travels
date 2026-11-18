import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Account service is not configured." }, { status: 503 });
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) return NextResponse.json({ error: "Sign in to view bookings." }, { status: 401 });
  const { data, error } = await supabase.from("bookings")
    .select("id,reference,traveller_count,total_inr,status,created_at,departures(starts_on,ends_on,trips(title,slug,destination)),pickup_points(name)")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: "Unable to load your bookings." }, { status: 503 });
  return NextResponse.json({ bookings: data });
}

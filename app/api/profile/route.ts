import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const profileSchema = z.object({ fullName: z.string().trim().min(2).max(80), phone: z.string().trim().min(10).max(16) });

export async function GET() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Account service is not configured." }, { status: 503 });
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (!userId) return NextResponse.json({ error: "Sign in to view your profile." }, { status: 401 });
  const { data: profile, error } = await supabase.from("profiles").select("full_name,phone").eq("id", userId).maybeSingle();
  if (error) return NextResponse.json({ error: "Unable to load your profile." }, { status: 503 });
  return NextResponse.json({ email: claims.claims.email ?? "", profile });
}

export async function PATCH(request: Request) {
  const parsed = profileSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Enter a name and a valid phone number." }, { status: 400 });
  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Account service is not configured." }, { status: 503 });
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (!userId) return NextResponse.json({ error: "Sign in to update your profile." }, { status: 401 });
  const { error } = await supabase.from("profiles").update({ full_name: parsed.data.fullName, phone: parsed.data.phone, updated_at: new Date().toISOString() }).eq("id", userId);
  if (error) return NextResponse.json({ error: "Unable to save your profile." }, { status: 503 });
  return NextResponse.json({ message: "Profile updated" });
}

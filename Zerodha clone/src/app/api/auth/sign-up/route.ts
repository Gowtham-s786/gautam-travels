import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const schema = z.object({ email: z.string().trim().email().max(254), password: z.string().min(10).max(128) }).strict();
export async function POST(request: NextRequest) {
  if (request.headers.get("content-type")?.split(";")[0] !== "application/json") return NextResponse.json({ error: "JSON body required" }, { status: 415 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Enter a valid email and a password of at least 10 characters." }, { status: 400 });
  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Authentication is not configured. Add the dedicated Supabase project settings." }, { status: 503 });
  const { data, error } = await supabase.auth.signUp({ ...parsed.data, options: { emailRedirectTo: `${new URL(request.url).origin}/api/auth/callback` } });
  if (error) return NextResponse.json({ error: "Account creation could not be completed. Check Supabase Auth settings." }, { status: 400 });
  return NextResponse.json({ ok: true, message: data.session ? "Account created. You can sign in." : "Check your email to confirm your account, then sign in." }, { status: 201, headers: { "cache-control": "no-store" } });
}

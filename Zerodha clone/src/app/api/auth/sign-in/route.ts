import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const schema = z.object({ email: z.string().trim().email().max(254), password: z.string().min(8).max(128) }).strict();
export async function POST(request: NextRequest) {
  if (request.headers.get("content-type")?.split(";")[0] !== "application/json") return NextResponse.json({ error: "JSON body required" }, { status: 415 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Enter a valid email and password." }, { status: 400 });
  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Authentication is not configured. Add the dedicated Supabase project settings." }, { status: 503 });
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return NextResponse.json({ error: "Sign in could not be completed. Check your details or Supabase Auth settings." }, { status: 401 });
  return NextResponse.json({ ok: true }, { headers: { "cache-control": "no-store" } });
}

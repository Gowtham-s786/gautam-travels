import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
const schema = z.object({ name: z.string().trim().min(1).max(40) }).strict();

export async function GET() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Database is not configured" }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const { data, error } = await supabase.from("watchlists").select("id,name,created_at").order("created_at", { ascending: true });
  if (error) return NextResponse.json({ error: "Could not load watchlists" }, { status: 500 });
  return NextResponse.json({ watchlists: data }, { headers: { "cache-control": "no-store" } });
}

export async function POST(request: NextRequest) {
  if (request.headers.get("content-type")?.split(";")[0] !== "application/json") return NextResponse.json({ error: "JSON body required" }, { status: 415 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Watchlist name must be 1–40 characters." }, { status: 400 });
  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Database is not configured" }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const { data, error } = await supabase.from("watchlists").insert({ user_id: user.id, name: parsed.data.name }).select("id,name,created_at").single();
  if (error) return NextResponse.json({ error: error.code === "23505" ? "A watchlist with that name already exists." : "Could not create watchlist." }, { status: error.code === "23505" ? 409 : 500 });
  return NextResponse.json({ watchlist: data }, { status: 201, headers: { "cache-control": "no-store" } });
}

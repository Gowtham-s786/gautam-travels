import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const next = request.nextUrl.searchParams.get("next") || "/account/dashboard";
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/account/dashboard";
  const supabase = await createSupabaseServerClient();
  if (code && supabase) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(safeNext, request.url));
  }
  const login = new URL("/account/login", request.url);
  login.searchParams.set("error", "confirmation");
  return NextResponse.redirect(login);
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const bodySchema = z.object({
  action: z.enum(["login", "register", "forgot", "logout"]),
  name: z.string().trim().min(2).max(80).optional(),
  email: z.string().trim().email(),
  password: z.string().min(8).max(128).optional(),
});

export async function POST(request: Request) {
  try {
    const parsed = bodySchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Enter a valid email and complete the required fields." }, { status: 400 });
    const supabase = await createSupabaseServerClient();
    if (!supabase) return NextResponse.json({ error: "Account access is not configured yet." }, { status: 503 });
    const { action, email, password, name } = parsed.data;
    const origin = new URL(request.url).origin;

    if (action === "login") {
      if (!password) return NextResponse.json({ error: "Enter your password." }, { status: 400 });
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return NextResponse.json({ error: "We could not sign you in. Check your email and password." }, { status: 401 });
      return NextResponse.json({ message: "Signed in" });
    }
    if (action === "register") {
      if (!password || !name) return NextResponse.json({ error: "Enter your name and a password with at least 8 characters." }, { status: 400 });
      const { data, error } = await supabase.auth.signUp({
        email, password, options: { data: { full_name: name }, emailRedirectTo: `${origin}/auth/callback?next=/account/dashboard` },
      });
      if (error) return NextResponse.json({ error: "We could not create that account. Please try again." }, { status: 400 });
      return NextResponse.json({ message: data.session ? "Account created" : "Check your email to confirm your account." });
    }
    if (action === "forgot") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${origin}/auth/callback?next=/account/profile` });
      if (error) return NextResponse.json({ error: "We could not send a recovery email. Please try again." }, { status: 400 });
      return NextResponse.json({ message: "If an account exists for that address, a recovery link is on its way." });
    }
    const { error } = await supabase.auth.signOut();
    if (error) return NextResponse.json({ error: "Unable to sign out right now." }, { status: 400 });
    return NextResponse.json({ message: "Signed out" });
  } catch {
    return NextResponse.json({ error: "Account request failed. Please try again." }, { status: 500 });
  }
}

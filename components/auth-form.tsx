"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Button } from "./button";

type AuthMode = "login" | "register" | "forgot";

export function AuthForm({ mode }: { mode: AuthMode }) {
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const copy = { login: { eyebrow: "Welcome back", title: "Your next trip is closer than you think.", action: "Sign in", helper: "New to Gautam Travels?", helperLink: "/account/register", helperText: "Create an account" }, register: { eyebrow: "Start your travel space", title: "Keep the good plans together.", action: "Create account", helper: "Already have an account?", helperLink: "/account/login", helperText: "Sign in" }, forgot: { eyebrow: "A small reset", title: "Let us get you back in.", action: "Send reset link", helper: "Remembered your password?", helperLink: "/account/login", helperText: "Sign in" } }[mode];
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setLoading(true); setError(""); setMessage("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: mode, name: form.get("name"), email: form.get("email"), password: form.get("password") }) });
    const result = await response.json(); setLoading(false);
    if (!response.ok) { setError(result.error || "Unable to continue right now."); return; }
    if (mode === "login") { window.location.assign("/account/dashboard"); return; }
    setMessage(result.message || "Check your inbox for the next step.");
    setSubmitted(true);
  };
  return <main className="pt-28"><section className="mx-auto grid max-w-5xl gap-8 px-5 pb-24 lg:grid-cols-[.85fr_1.15fr] lg:px-8"><div className="rounded-[2rem] bg-forest p-8 text-white md:p-10"><p className="eyebrow text-saffron">{copy.eyebrow}</p><h1 className="mt-6 font-display text-5xl leading-[.98] tracking-[-.05em]">{copy.title}</h1><p className="mt-6 text-sm leading-7 text-white/60">Access your bookings, keep your traveller details close and spend less time looking for confirmation emails.</p><div className="mt-12 border-t border-white/15 pt-5 text-xs text-white/45">Sign in and bookings are handled securely through your Gautam Travels account.</div></div><div className="rounded-[2rem] bg-white p-6 shadow-soft md:p-10">{submitted ? <div className="flex min-h-[360px] flex-col justify-center"><div className="grid h-12 w-12 place-items-center rounded-full bg-saffron/20 text-forest">✓</div><h2 className="mt-6 font-display text-4xl">Check your inbox.</h2><p className="mt-4 max-w-sm text-sm leading-6 text-ink/55">{message}</p><Button href="/trips" className="mt-8 w-fit">Browse trips</Button></div> : <form onSubmit={submit} className="space-y-5"><div><h2 className="text-xl font-semibold">{copy.action}</h2><p className="mt-2 text-sm text-ink/50">{mode === "forgot" ? "Enter your account email and we will send a recovery link." : "Use the email you want connected to your Gautam Travels account."}</p></div>{mode === "register" && <label className="block text-sm font-semibold">Full name<input required name="name" className="mt-2 w-full rounded-xl border border-ink/15 bg-cream px-4 py-3 text-sm font-normal outline-none focus:border-forest" placeholder="Your name" /></label>}<label className="block text-sm font-semibold">Email address<input required type="email" name="email" className="mt-2 w-full rounded-xl border border-ink/15 bg-cream px-4 py-3 text-sm font-normal outline-none focus:border-forest" placeholder="you@email.com" /></label>{mode !== "forgot" && <label className="block text-sm font-semibold">Password<input required type="password" name="password" minLength={8} className="mt-2 w-full rounded-xl border border-ink/15 bg-cream px-4 py-3 text-sm font-normal outline-none focus:border-forest" placeholder="At least 8 characters" /></label>}{mode === "login" && <div className="text-right"><Link href="/account/forgot-password" className="text-xs font-semibold text-forest hover:text-ink">Forgot password?</Link></div>}{error && <p className="rounded-xl bg-clay/10 p-3 text-sm text-clay">{error}</p>}<button type="submit" disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-forest px-5 py-3 text-sm font-semibold text-white hover:bg-ink disabled:opacity-50">{loading ? "Please wait…" : copy.action}</button><p className="text-center text-sm text-ink/50">{copy.helper} <Link href={copy.helperLink} className="font-semibold text-forest">{copy.helperText}</Link></p></form>}</div></section></main>;
}

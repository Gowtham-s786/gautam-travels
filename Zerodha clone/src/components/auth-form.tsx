"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/auth/sign-in", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email, password }) });
      const data = await response.json();
      if (!response.ok) { setMessage(data.error ?? "Sign in failed."); return; }
      window.location.assign("/dashboard");
    } catch { setMessage("Could not reach the sign-in service."); }
    finally { setBusy(false); }
  }

  return <main className="auth-page"><section className="auth-card"><Link className="brand" href="/"><span className="brand-mark">N</span><span>northstar<span className="brand-dot">.</span></span></Link><p className="eyebrow">YOUR INVESTING SPACE</p><h1>Welcome back.</h1><p className="auth-copy">Sign in to access your saved watchlists and account workspace.</p><form onSubmit={submit} className="auth-form"><label>Email address<input type="email" autoComplete="email" required maxLength={254} value={email} onChange={e => setEmail(e.target.value)} /></label><label>Password<input type="password" autoComplete="current-password" required minLength={8} maxLength={128} value={password} onChange={e => setPassword(e.target.value)} /></label><button disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>{message && <p role="status" className="auth-message">{message}</p>}</form><p className="auth-foot">New here? <Link href="/register">Create an account</Link></p><p className="auth-disclaimer">Demo trading is simulated. This app is not a registered stockbroker and does not provide investment advice.</p></section></main>;
}

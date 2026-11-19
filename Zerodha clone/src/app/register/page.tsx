"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [message, setMessage] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setMessage("");
    try { const response = await fetch("/api/auth/sign-up", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email, password }) }); const data = await response.json(); setMessage(response.ok ? data.message : data.error); }
    catch { setMessage("Could not reach the account service."); } finally { setBusy(false); }
  }
  return <main className="auth-page"><section className="auth-card"><Link className="brand" href="/"><span className="brand-mark">N</span><span>northstar<span className="brand-dot">.</span></span></Link><p className="eyebrow">GET STARTED</p><h1>Create your login.</h1><p className="auth-copy">This creates an app account only. It does not open a brokerage or demat account.</p><form onSubmit={submit} className="auth-form"><label>Email address<input type="email" autoComplete="email" required maxLength={254} value={email} onChange={e => setEmail(e.target.value)} /></label><label>Password<input type="password" autoComplete="new-password" required minLength={10} maxLength={128} value={password} onChange={e => setPassword(e.target.value)} /></label><button disabled={busy}>{busy ? "Creating…" : "Create account"}</button>{message && <p role="status" className="auth-message">{message}</p>}</form><p className="auth-foot">Already registered? <Link href="/login">Sign in</Link></p><p className="auth-disclaimer">KYC, demat onboarding, trading, and funds are not connected in this starter.</p></section></main>;
}

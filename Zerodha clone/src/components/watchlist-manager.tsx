"use client";

import { FormEvent, useState } from "react";

type Watchlist = { id: string; name: string; created_at: string };
export function WatchlistManager({ initialLists }: { initialLists: Watchlist[] }) {
  const [lists, setLists] = useState(initialLists); const [name, setName] = useState(""); const [message, setMessage] = useState(""); const [busy, setBusy] = useState(false);
  async function create(event: FormEvent) {
    event.preventDefault(); setBusy(true); setMessage("");
    try { const response = await fetch("/api/watchlists", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name }) }); const data = await response.json(); if (!response.ok) { setMessage(data.error ?? "Could not create watchlist."); return; } setLists(current => [...current, data.watchlist]); setName(""); }
    catch { setMessage("Could not reach the watchlist service."); } finally { setBusy(false); }
  }
  return <><form className="watchlist-create" onSubmit={create}><input aria-label="New watchlist name" value={name} onChange={e => setName(e.target.value)} placeholder="For example, Long-term ideas" minLength={1} maxLength={40} required/><button disabled={busy}>{busy ? "Saving…" : "Create watchlist"}</button></form>{message && <p className="auth-message" role="status">{message}</p>}<div className="watchlist-grid">{lists.map(list => <article className="watchlist-card" key={list.id}><span className="paper-pill">APP DATA</span><h2>{list.name}</h2><p>Private to your account. Add instruments after a licensed market-data source is selected.</p></article>)}{!lists.length && <p className="empty-watchlists">No watchlists saved yet. Create one above. The homepage watchlist is sample content.</p>}</div></>;
}

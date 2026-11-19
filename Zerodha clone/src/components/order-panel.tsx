"use client";

import { useRef, useState } from "react";
import { z } from "zod";

const schema = z.object({ symbol: z.string().min(1).max(20), side: z.enum(["BUY", "SELL"]), quantity: z.number().int().positive().max(100000) });

export function OrderPanel() {
  const [side, setSide] = useState<"BUY" | "SELL">("BUY");
  const [symbol, setSymbol] = useState("RELIANCE");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const requestId = useRef<string | null>(null);

  async function submit() {
    const parsed = schema.safeParse({ symbol: symbol.trim().toUpperCase(), side, quantity: Number(quantity) });
    if (!parsed.success) { setMessage("Enter a valid symbol and whole number of shares."); return; }
    setBusy(true); setMessage("");
    requestId.current ??= crypto.randomUUID();
    try {
      const response = await fetch("/api/orders", { method: "POST", headers: { "content-type": "application/json", "x-idempotency-key": requestId.current }, body: JSON.stringify(parsed.data) });
      const data = await response.json();
      setMessage(response.ok ? `Paper order ${data.order.id} · ${data.order.status}` : data.error ?? "Order could not be placed.");
      if (response.ok) requestId.current = null;
    } catch { setMessage("Could not reach the paper order service."); }
    finally { setBusy(false); }
  }

  return <div className="order-form"><div className="side-toggle"><button className={side === "BUY" ? "buy-selected" : ""} onClick={() => setSide("BUY")}>Buy</button><button className={side === "SELL" ? "sell-selected" : ""} onClick={() => setSide("SELL")}>Sell</button></div><label>Instrument<input value={symbol} onChange={(e) => setSymbol(e.target.value)} aria-label="Instrument symbol"/></label><div className="order-fields"><label>Quantity<input type="number" min="1" max="100000" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}/></label><label>Order type<select defaultValue="MARKET"><option>MARKET</option><option>LIMIT</option></select></label></div><div className="estimate-line"><span>Estimated value</span><b>₹ —</b></div><button className={side === "BUY" ? "submit-buy" : "submit-sell"} onClick={submit} disabled={busy}>{busy ? "Submitting…" : `${side === "BUY" ? "Buy" : "Sell"} in paper account`}</button>{message && <p className="order-result" role="status">{message}</p>}</div>;
}

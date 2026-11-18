"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, LockKeyhole, Minus, Plus, Tag } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/format";
import { Trip } from "@/lib/types";

export function CheckoutForm({ trip, departureId }: { trip: Trip; departureId?: string }) {
  const selected = trip.departures.find((d) => d.id === departureId) ?? trip.departures[0];
  const [count, setCount] = useState(1);
  const [coupon, setCoupon] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [discount, setDiscount] = useState(0);
  const subtotal = selected.price * count;
  const total = subtotal - discount;

  const applyCoupon = async () => {
    setCouponMessage("");
    const response = await fetch("/api/coupons/validate", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tripSlug: trip.slug, departureId: selected.id, travellerCount: count, couponCode: coupon }),
    });
    const result = await response.json();
    if (!response.ok || !result.valid) {
      setDiscount(0);
      setCouponMessage(result.message || result.error || "That coupon is not available.");
      return;
    }
    setDiscount(result.discount);
    setCouponMessage(`Coupon applied · You save ${formatCurrency(result.discount)}`);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setSubmitting(true); setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/bookings", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tripSlug: trip.slug, departureId: selected.id, travellerCount: count, pickupPoint: form.get("pickupPoint"), coupon: discount ? coupon : undefined, customer: { name: form.get("name"), email: form.get("email"), phone: form.get("phone") } }),
    });
    const data = await response.json();
    if (!response.ok) { setError(data.error || "We could not create the booking. Please try again."); setSubmitting(false); return; }
    window.location.href = `/confirmation?reference=${encodeURIComponent(data.reference)}`;
  };

  return <main className="pt-28"><section className="mx-auto max-w-6xl px-5 pb-24 lg:px-8">
    <Link href={`/trips/${trip.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-ink/55 hover:text-forest"><ArrowLeft className="h-4 w-4" /> Back to trip</Link>
    <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
      <div><p className="eyebrow text-clay">Almost there</p><h1 className="mt-4 font-display text-5xl tracking-[-.05em]">Book your <em className="font-normal text-forest">escape.</em></h1>
        <div className="mt-8 flex items-center gap-4 rounded-2xl bg-sand/50 p-4"><img src={trip.image} alt="" className="h-16 w-20 rounded-xl object-cover" /><div><p className="font-semibold">{trip.title}</p><p className="mt-1 text-sm text-ink/55">{formatDate(selected.date)} · {trip.destination}</p></div></div>
        <form onSubmit={submit} className="mt-8 space-y-7 rounded-[1.75rem] bg-white p-6 shadow-sm md:p-8">
          <div><h2 className="text-lg font-semibold">Your details</h2><p className="mt-1 text-sm text-ink/50">We use these to manage your seat hold and trip updates.</p>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-semibold">Full name<input required name="name" className="mt-2 w-full rounded-xl border border-ink/15 bg-cream px-4 py-3 text-sm font-normal outline-none focus:border-forest" placeholder="Your name" /></label>
              <label className="text-sm font-semibold">Email address<input required type="email" name="email" className="mt-2 w-full rounded-xl border border-ink/15 bg-cream px-4 py-3 text-sm font-normal outline-none focus:border-forest" placeholder="you@email.com" /></label>
              <label className="text-sm font-semibold">Mobile number<input required name="phone" className="mt-2 w-full rounded-xl border border-ink/15 bg-cream px-4 py-3 text-sm font-normal outline-none focus:border-forest" placeholder="+91 98765 43210" /></label>
              <label className="text-sm font-semibold">Pickup point<select required name="pickupPoint" defaultValue={trip.pickupPoints[0]} className="mt-2 w-full rounded-xl border border-ink/15 bg-cream px-4 py-3 text-sm font-normal outline-none focus:border-forest">{trip.pickupPoints.map((point) => <option key={point}>{point}</option>)}</select></label>
            </div>
          </div>
          <div className="border-t border-ink/10 pt-7"><div className="flex items-center justify-between"><div><h2 className="text-lg font-semibold">Travellers</h2><p className="mt-1 text-sm text-ink/50">How many seats should we hold?</p></div><div className="flex items-center gap-4 rounded-full border border-ink/15 p-1"><button type="button" onClick={() => setCount(Math.max(1, count - 1))} className="grid h-8 w-8 place-items-center rounded-full hover:bg-sand" aria-label="Remove traveller"><Minus className="h-4 w-4" /></button><span className="w-4 text-center text-sm font-semibold">{count}</span><button type="button" onClick={() => setCount(Math.min(12, count + 1))} className="grid h-8 w-8 place-items-center rounded-full hover:bg-sand" aria-label="Add traveller"><Plus className="h-4 w-4" /></button></div></div></div>
          <div className="border-t border-ink/10 pt-7"><div className="flex items-center gap-2 text-sm font-semibold"><LockKeyhole className="h-4 w-4 text-forest" />Seat hold</div><p className="mt-2 text-xs leading-5 text-ink/50">Your seats will be held for 10 minutes. Online payment is not configured yet, so no payment will be collected.</p></div>
          {error && <p className="rounded-xl bg-clay/10 p-3 text-sm text-clay">{error}</p>}
          <button disabled={submitting} type="submit" className="w-full rounded-full bg-forest px-5 py-4 text-sm font-semibold text-white transition hover:bg-ink disabled:cursor-wait disabled:opacity-50">{submitting ? "Holding your seats…" : `Reserve seats · ${formatCurrency(total)}`}</button>
        </form>
      </div>
      <aside className="h-fit rounded-[1.75rem] bg-forest p-6 text-white lg:sticky lg:top-8"><p className="eyebrow text-white/50">Your booking</p>
        <div className="mt-7 space-y-5 border-b border-white/15 pb-6 text-sm"><div className="flex justify-between gap-4"><span className="text-white/60">{formatCurrency(selected.price)} × {count} {count === 1 ? "traveller" : "travellers"}</span><span>{formatCurrency(subtotal)}</span></div><div className="flex justify-between gap-4"><span className="text-white/60">Pickup</span><span>{trip.pickupPoints[0]}</span></div></div>
        <div className="mt-5 flex gap-2"><div className="relative flex-1"><Tag className="absolute left-3 top-3 h-4 w-4 text-white/45" /><input value={coupon} onChange={(event) => setCoupon(event.target.value)} placeholder="Coupon code" className="w-full rounded-xl border border-white/15 bg-white/10 py-3 pl-10 pr-3 text-sm outline-none placeholder:text-white/40 focus:border-saffron" /></div><button type="button" onClick={applyCoupon} className="rounded-xl bg-white/10 px-4 text-sm font-semibold hover:bg-white/20">Apply</button></div>
        {couponMessage && <p className="mt-2 text-xs text-saffron">{couponMessage}</p>}
        <div className="mt-7 flex items-end justify-between"><span className="text-sm text-white/60">Total</span><span className="text-3xl font-semibold">{formatCurrency(total)}</span></div><div className="mt-5 flex gap-2 text-xs text-white/50"><Check className="h-4 w-4 text-saffron" /> No payment is charged</div>
      </aside>
    </div>
  </section></main>;
}

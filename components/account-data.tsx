"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { ArrowUpRight, CalendarDays, Download, UserRound } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/format";

type BookingSummary = { reference: string; traveller_count: number; total_inr: number; status: string; departures?: { starts_on: string; ends_on: string; trips?: { title: string; destination: string } } | null; pickup_points?: { name: string } | null };

export function AccountBookings() {
  const [bookings, setBookings] = useState<BookingSummary[]>([]);
  const [message, setMessage] = useState("Loading your bookings…");
  useEffect(() => { fetch("/api/account/bookings").then(async (res) => { const data = await res.json(); if (!res.ok) throw new Error(data.error); setBookings(data.bookings); setMessage(data.bookings.length ? "" : "You do not have any bookings yet."); }).catch((error) => setMessage(error.message || "Unable to load bookings.")); }, []);
  return <div className="mt-10 rounded-[2rem] bg-white p-6 shadow-sm md:p-8"><div className="flex items-center gap-3 text-sm font-semibold"><CalendarDays className="h-4 w-4 text-forest" />My bookings</div>{message && <div className="py-10 text-center text-sm text-ink/50">{message}<p className="mt-4"><Link href="/trips" className="font-semibold text-forest">Find a trip ↗</Link></p></div>}<div className="mt-6 space-y-3">{bookings.map((booking) => <Link key={booking.reference} href={`/account/bookings/${booking.reference}`} className="flex items-center justify-between gap-4 rounded-2xl bg-cream p-4 transition hover:bg-sand"><span><span className="block font-semibold">{booking.departures?.trips?.title ?? "Gautam Travels booking"}</span><span className="mt-1 block text-xs text-ink/50">{booking.departures ? `${formatDate(booking.departures.starts_on)} · ${booking.departures.trips?.destination ?? "India"}` : booking.reference}</span></span><span className="text-right"><span className="block text-sm font-semibold text-forest">{formatCurrency(booking.total_inr)}</span><span className="mt-1 block text-xs capitalize text-ink/45">{booking.status}</span></span></Link>)}</div></div>;
}

export function BookingInformation({ reference }: { reference: string }) {
  const [booking, setBooking] = useState<BookingSummary & { subtotal_inr?: number; discount_inr?: number; payments?: { status: string }[] } | null>(null);
  const [message, setMessage] = useState("Loading booking details…");
  useEffect(() => { fetch(`/api/account/bookings/${encodeURIComponent(reference)}`).then(async (res) => { const data = await res.json(); if (!res.ok) throw new Error(data.error); setBooking(data.booking); setMessage(""); }).catch((error) => setMessage(error.message || "Unable to load this booking.")); }, [reference]);
  if (!booking) return <p className="mt-8 rounded-2xl bg-white p-6 text-sm text-ink/55">{message}</p>;
  return <div className="mt-6 rounded-[2rem] bg-white p-6 shadow-sm md:p-8"><p className="text-sm font-semibold text-forest">Booking status · {booking.status}</p><div className="mt-7 grid gap-5 border-t border-ink/10 pt-6 sm:grid-cols-2"><Field label="Trip" value={booking.departures?.trips?.title ?? "Gautam Travels"} /><Field label="Departure" value={booking.departures ? formatDate(booking.departures.starts_on) : "—"} /><Field label="Travellers" value={String(booking.traveller_count)} /><Field label="Pickup" value={booking.pickup_points?.name ?? "—"} /><Field label="Total" value={formatCurrency(booking.total_inr)} /><Field label="Payment" value={booking.payments?.[0]?.status ?? "Payment not recorded"} /></div><button onClick={() => window.print()} className="mt-8 inline-flex items-center gap-2 rounded-full border border-ink/15 px-5 py-3 text-sm font-semibold hover:border-forest hover:text-forest"><Download className="h-4 w-4" /> Save details</button></div>;
}

function Field({ label, value }: { label: string; value: string }) { return <div><p className="eyebrow text-ink/40">{label}</p><p className="mt-2 font-semibold">{value}</p></div>; }

export function ProfileEditor() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("Loading your profile…");
  const [error, setError] = useState("");
  useEffect(() => { fetch("/api/profile").then(async (res) => { const data = await res.json(); if (!res.ok) throw new Error(data.error); setEmail(data.email); setFullName(data.profile?.full_name ?? ""); setPhone(data.profile?.phone ?? ""); setMessage(""); }).catch((e) => setMessage(e.message)); }, []);
  const save = async (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setError(""); const response = await fetch("/api/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fullName, phone }) }); const data = await response.json(); if (!response.ok) { setError(data.error); return; } setMessage("Your profile is up to date."); };
  const signOut = async () => { const response = await fetch("/api/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "logout", email: email || "account@example.com" }) }); if (response.ok) window.location.assign("/"); };
  return <div className="mt-10 rounded-[2rem] bg-white p-6 shadow-sm md:p-8"><div className="flex items-center gap-3 text-sm font-semibold"><UserRound className="h-4 w-4 text-forest" />Profile details</div>{message && <p className="mt-5 text-sm text-ink/55">{message}</p>}<form onSubmit={save} className="mt-6 grid gap-5 sm:grid-cols-2"><label className="text-sm font-semibold">Full name<input required value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-2 w-full rounded-xl border border-ink/15 bg-cream px-4 py-3 text-sm font-normal" /></label><label className="text-sm font-semibold">Email address<input value={email} disabled className="mt-2 w-full rounded-xl border border-ink/10 bg-sand/40 px-4 py-3 text-sm font-normal text-ink/45" /></label><label className="text-sm font-semibold">Mobile number<input required value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-2 w-full rounded-xl border border-ink/15 bg-cream px-4 py-3 text-sm font-normal" /></label><div className="flex items-end gap-3"><button className="rounded-full bg-forest px-5 py-3 text-sm font-semibold text-white">Save profile</button><button type="button" onClick={signOut} className="rounded-full border border-ink/15 px-5 py-3 text-sm font-semibold">Sign out</button></div>{error && <p className="text-sm text-clay sm:col-span-2">{error}</p>}</form></div>;
}

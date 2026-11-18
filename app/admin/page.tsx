import Link from "next/link";
import { ArrowUpRight, CalendarDays, Inbox, LayoutDashboard, Map, Users } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatCurrency, formatDate } from "@/lib/format";

export const metadata = { title: "Admin dashboard" };
export const dynamic = "force-dynamic";

const nav = [
  ["Overview", "/admin", LayoutDashboard],
  ["Trips", "/admin/trips", Map],
  ["Bookings", "/admin/bookings", CalendarDays],
  ["Customers", "/admin/customers", Users],
  ["Enquiries", "/admin/enquiries", Inbox],
] as const;

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient();
  const today = new Date().toISOString().slice(0, 10);
  const [bookings, confirmed, enquiries, payments, departures, recent] = supabase
    ? await Promise.all([
        supabase.from("bookings").select("id", { count: "exact", head: true }),
        supabase.from("bookings").select("id", { count: "exact", head: true }).eq("status", "confirmed"),
        supabase.from("enquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("payments").select("amount_inr").eq("status", "captured"),
        supabase.from("departures").select("id,starts_on,price_inr,seats_total,seats_booked,trips(title)").eq("is_active", true).gte("starts_on", today).order("starts_on").limit(3),
        supabase.from("bookings").select("reference,status,created_at").order("created_at", { ascending: false }).limit(3),
      ])
    : [null, null, null, null, null, null];

  const revenue = payments?.data?.reduce((sum, payment) => sum + Number(payment.amount_inr || 0), 0) ?? 0;
  const upcoming = departures?.data ?? [];
  const recentBookings = recent?.data ?? [];

  return <main className="min-h-screen bg-[#eef0ea] pt-24"><div className="mx-auto max-w-7xl px-5 pb-20 lg:px-8">
    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="eyebrow text-clay">Gautam Travels / Admin</p><h1 className="mt-3 font-display text-5xl tracking-[-.05em]">Business overview</h1><p className="mt-3 text-sm text-ink/55">Live totals from your connected Supabase project.</p></div><div className="rounded-full bg-forest/10 px-4 py-2 text-xs font-semibold text-forest">Admin access verified</div></div>
    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Metric label="Total bookings" value={bookings ? String(bookings.count ?? 0) : "—"} detail="All booking records" />
      <Metric label="Confirmed" value={confirmed ? String(confirmed.count ?? 0) : "—"} detail="Confirmed bookings" />
      <Metric label="Captured revenue" value={payments ? formatCurrency(revenue) : "—"} detail="Payments marked captured" />
      <Metric label="New enquiries" value={enquiries ? String(enquiries.count ?? 0) : "—"} detail="Awaiting a reply" />
    </div>
    <div className="mt-10 grid gap-6 lg:grid-cols-[.75fr_1.25fr]"><aside className="rounded-[1.75rem] bg-ink p-5 text-white"><p className="eyebrow px-3 text-white/45">Workspace</p><nav className="mt-5 space-y-1">{nav.map(([label, href, Icon]) => <Link key={href} href={href} className={`flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold ${href === "/admin" ? "bg-white/10 text-white" : "text-white/55 hover:bg-white/10 hover:text-white"}`}><span className="flex items-center gap-3"><Icon className="h-4 w-4" />{label}</span><ArrowUpRight className="h-3.5 w-3.5 opacity-50" /></Link>)}</nav><div className="mt-8 rounded-2xl border border-white/10 p-4"><p className="text-xs font-semibold text-saffron">Access control</p><p className="mt-2 text-xs leading-5 text-white/55">Only signed-in accounts listed in Supabase admin_users can open this workspace.</p></div></aside>
      <div className="space-y-6"><div className="rounded-[1.75rem] bg-white p-6"><div className="flex items-center justify-between"><div><p className="eyebrow text-clay">Upcoming departures</p><h2 className="mt-2 text-xl font-semibold">Next dates on sale</h2></div><Link href="/trips" className="text-sm font-semibold text-forest">View customer site ↗</Link></div><div className="mt-6 space-y-3">{upcoming.length ? upcoming.map((departure) => <div key={departure.id} className="flex items-center justify-between gap-4 rounded-2xl bg-cream p-4"><div><p className="text-sm font-semibold">{tripTitle(departure.trips)}</p><p className="mt-1 text-xs text-ink/50">{formatDate(departure.starts_on)} · {Math.max(departure.seats_total - departure.seats_booked, 0)} seats remaining</p></div><p className="shrink-0 text-sm font-semibold text-forest">{formatCurrency(departure.price_inr)}</p></div>) : <EmptyState text="There are no upcoming active departures." />}</div></div>
        <div className="rounded-[1.75rem] bg-white p-6"><p className="eyebrow text-clay">Recent bookings</p><div className="mt-5 space-y-4">{recentBookings.length ? recentBookings.map((booking) => <div key={booking.reference} className="flex justify-between gap-4 border-b border-ink/10 pb-4 text-sm"><span><span className="block font-semibold">{booking.reference}</span><span className="text-xs text-ink/45">{formatDate(String(booking.created_at).slice(0, 10))}</span></span><span className="text-xs font-semibold capitalize text-forest">{booking.status}</span></div>) : <EmptyState text="New bookings will appear here." />}</div></div>
      </div>
    </div>
  </div></main>;
}

function tripTitle(value: unknown) {
  if (Array.isArray(value)) return String(value[0]?.title ?? "Trip");
  if (value && typeof value === "object" && "title" in value) return String(value.title);
  return "Trip";
}

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <div className="rounded-3xl bg-white p-5"><p className="text-xs text-ink/50">{label}</p><p className="mt-4 text-3xl font-semibold tracking-[-.04em]">{value}</p><p className="mt-2 text-xs text-ink/50">{detail}</p></div>;
}

function EmptyState({ text }: { text: string }) {
  return <p className="rounded-2xl bg-cream p-4 text-sm text-ink/55">{text}</p>;
}

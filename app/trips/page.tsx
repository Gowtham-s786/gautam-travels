import { getTrips } from "@/lib/trips";
import { TripCard } from "@/components/trip-card";
import { SectionHeading } from "@/components/section-heading";

export const metadata = { title: "All trips" };
export const dynamic = "force-dynamic";

export default async function TripsPage() {
  const trips = await getTrips();
  return <main className="pt-28"><section className="mx-auto max-w-7xl px-5 pb-16 lg:px-8"><div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-end"><SectionHeading eyebrow="Find your pace" title={<>Trips that leave<br /><em className="font-normal text-forest">room for living.</em></>} description="Choose a weekend that sounds like you. Every trip includes clear dates, pickup points and the details you need before saying yes." /><div className="flex flex-wrap gap-2 lg:justify-end"><span className="rounded-full bg-forest px-4 py-2 text-sm font-semibold text-white">All trips</span><span className="rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold">Weekend escapes</span><span className="rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold">Treks</span><span className="rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold">Culture</span></div></div><div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{trips.map((trip) => <TripCard trip={trip} key={trip.slug} />)}</div></section><section className="border-t border-ink/10 bg-sand/45"><div className="mx-auto max-w-7xl px-5 py-16 lg:px-8"><div className="flex flex-col justify-between gap-6 rounded-[1.75rem] bg-cream p-8 shadow-sm md:flex-row md:items-center md:p-10"><div><p className="eyebrow mb-3 text-clay">Planning something different?</p><h2 className="font-display text-3xl tracking-[-.03em]">Build a private trip for your group.</h2><p className="mt-3 max-w-xl text-sm leading-6 text-ink/55">Corporate offsites, birthdays, family escapes or a route that is entirely your own.</p></div><a href="/contact" className="shrink-0 rounded-full bg-forest px-5 py-3 text-sm font-semibold text-white hover:bg-ink">Start an enquiry ↗</a></div></div></section></main>;
}

import { ArrowDown, ArrowRight, BadgeCheck, Compass, HeartHandshake, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/button";
import { SectionHeading } from "@/components/section-heading";
import { TripCard } from "@/components/trip-card";
import { getTrips } from "@/lib/trips";

export const dynamic = "force-dynamic";

const benefits = [
  { icon: Compass, title: "Routes with a point of view", text: "We spend time finding the places, stops and stays that make a trip feel like yours." },
  { icon: HeartHandshake, title: "A group that feels easy", text: "Small groups, kind trip leads and enough room to be social—or enjoy the quiet." },
  { icon: ShieldCheck, title: "The details handled", text: "Clear inclusions, honest pricing and support from the first question to the ride home." },
];

export default async function Home() {
  const trips = await getTrips();
  return <main>
    <section className="relative min-h-[720px] overflow-hidden bg-ink text-white">
      <img src="https://images.unsplash.com/photo-1464278533981-50106e6176b1?auto=format&fit=crop&w=2200&q=90" alt="Mountain road disappearing into a green valley" className="absolute inset-0 h-full w-full object-cover opacity-75" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/35 to-ink/15" /><div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-transparent to-ink/15" />
      <div className="grain absolute inset-0 bg-grain" />
      <div className="relative mx-auto flex min-h-[720px] max-w-7xl flex-col justify-end px-5 pb-24 pt-36 lg:px-8 lg:pb-28">
        <div className="max-w-3xl"><p className="eyebrow mb-6 text-saffron">Weekend escapes · Treks · New perspectives</p><h1 className="max-w-3xl font-display text-6xl leading-[.92] tracking-[-0.055em] md:text-8xl">Go further,<br /><em className="font-normal text-saffron">together.</em></h1><p className="mt-7 max-w-xl text-lg leading-8 text-white/75">Thoughtfully planned trips for people who want to see more, meet good people and come back with a story worth telling.</p><div className="mt-9 flex flex-wrap gap-3"><Button href="/trips" variant="light">Explore trips</Button><Button href="/about" variant="outline" className="border-white/30 text-white hover:border-white hover:text-white">Why Gautam?</Button></div></div>
        <a href="#upcoming" className="absolute bottom-7 right-5 hidden items-center gap-3 text-xs font-semibold uppercase tracking-[.15em] text-white/65 lg:flex">Scroll to explore <ArrowDown className="h-4 w-4" /></a>
      </div>
    </section>

    <section className="relative z-10 mx-auto -mt-8 max-w-6xl px-5 lg:-mt-12"><div className="grid gap-0 overflow-hidden rounded-[1.75rem] bg-cream shadow-soft md:grid-cols-[1.15fr_1fr_1fr_auto]"><div className="border-b border-ink/10 p-5 md:border-b-0 md:border-r"><p className="eyebrow text-ink/45">I want to</p><p className="mt-2 text-sm font-semibold">Find my next escape</p></div><div className="border-b border-ink/10 p-5 md:border-b-0 md:border-r"><p className="eyebrow text-ink/45">Where</p><p className="mt-2 text-sm font-semibold">Anywhere beautiful <span className="float-right text-ink/30">⌄</span></p></div><div className="border-b border-ink/10 p-5 md:border-b-0 md:border-r"><p className="eyebrow text-ink/45">When</p><p className="mt-2 text-sm font-semibold">Next available date <span className="float-right text-ink/30">⌄</span></p></div><Button href="/trips" className="m-3">Search trips</Button></div></section>

    <section id="upcoming" className="mx-auto max-w-7xl px-5 py-24 lg:px-8"><div className="flex flex-col justify-between gap-7 md:flex-row md:items-end"><SectionHeading eyebrow="Make a little room for wonder" title={<>Your next <em className="font-normal text-forest">good idea.</em></>} description="From misty hills to slow coastal mornings, find a trip with the right pace for where you are right now." /><Button href="/trips" variant="outline">See all trips</Button></div><div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">{trips.map((trip) => <TripCard trip={trip} key={trip.slug} />)}</div></section>

    <section className="border-y border-ink/10 bg-sand/45"><div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-[.95fr_1.5fr] lg:items-center lg:px-8"><SectionHeading eyebrow="The Gautam way" title={<>More than a plan.<br /><em className="font-normal text-clay">A better feeling.</em></>} description="You do not need to be an expert traveller, an outdoors person or the one who always has a plan. You just need a little curiosity." /><div className="grid gap-4 sm:grid-cols-3">{benefits.map(({ icon: Icon, title, text }) => <div key={title} className="rounded-3xl bg-cream p-5"><Icon className="h-6 w-6 text-forest" strokeWidth={1.5} /><h3 className="mt-8 text-base font-semibold leading-5">{title}</h3><p className="mt-3 text-sm leading-6 text-ink/55">{text}</p></div>)}</div></div></section>

    <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8"><div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center"><div className="relative aspect-[1.08] overflow-hidden rounded-[2rem]"><img src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1400&q=85" alt="Friends sharing a moment on a road trip" className="h-full w-full object-cover" /><div className="absolute bottom-5 left-5 rounded-2xl bg-cream p-4 shadow-soft"><p className="text-2xl font-semibold text-forest">12–18</p><p className="mt-1 text-xs text-ink/55">people per group</p></div></div><div className="max-w-xl lg:pl-10"><SectionHeading eyebrow="For the people who join us" title={<>Come for the place.<br /><em className="font-normal text-forest">Stay for the people.</em></>} description="Our trips are made for solo joiners, close friends, busy teams and anyone who wants the logistics to feel lighter. You bring your curiosity. We take care of the rest." /><div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold text-forest"><span className="rounded-full border border-forest/20 px-4 py-2">Solo-friendly</span><span className="rounded-full border border-forest/20 px-4 py-2">Pickup from Bengaluru</span><span className="rounded-full border border-forest/20 px-4 py-2">UPI accepted</span></div><div className="mt-9"><Button href="/about">Meet Gautam Travels</Button></div></div></div></section>

    <section className="bg-forest text-white"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-5 py-16 lg:flex-row lg:items-center lg:px-8"><div><p className="eyebrow mb-4 text-saffron">Not sure where to start?</p><h2 className="font-display text-4xl tracking-[-.04em] md:text-5xl">Tell us what kind of<br /><em className="font-normal text-saffron">weekend you need.</em></h2></div><Button href="/contact" variant="light">Talk to our team</Button></div></section>
  </main>;
}

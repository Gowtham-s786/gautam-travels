import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { destinations } from "@/lib/data";
import { SectionHeading } from "@/components/section-heading";

export const metadata = { title: "Destinations" };

export default function DestinationsPage() { return <main className="pt-28"><section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8"><SectionHeading eyebrow="Go where the feeling is" title={<>A map full of<br /><em className="font-normal text-forest">good weekends.</em></>} description="We start with the places that make you pause, then build a route around the way you want to feel." /><div className="mt-12 grid gap-5 md:grid-cols-2">{destinations.map((destination, i) => <Link key={destination.name} href="/trips" className={`group relative overflow-hidden rounded-[1.75rem] ${i === 0 || i === 3 ? "aspect-[1.3]" : "aspect-[1.15]"}`}><img src={destination.image} alt={destination.name} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" /><div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white"><div><p className="text-xs uppercase tracking-[.16em] text-white/65">{destination.state} · {destination.trips} trips</p><h2 className="mt-1 font-display text-4xl tracking-[-.04em]">{destination.name}</h2></div><span className="grid h-11 w-11 place-items-center rounded-full bg-white text-ink"><ArrowUpRight className="h-4 w-4" /></span></div></Link>)}</div></section></main>; }

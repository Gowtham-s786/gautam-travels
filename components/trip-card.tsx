import Link from "next/link";
import { ArrowUpRight, CalendarDays, MapPin, Users } from "lucide-react";
import { Trip } from "@/lib/types";
import { formatCurrency, formatDate, getAvailability } from "@/lib/format";

export function TripCard({ trip }: { trip: Trip }) {
  const departure = trip.departures[0];
  const seats = getAvailability(departure.seatsTotal, departure.seatsBooked);
  return <article className="group overflow-hidden rounded-[1.75rem] bg-white shadow-[0_8px_35px_rgba(23,33,27,.07)] transition-all duration-300 hover:-translate-y-1 hover:shadow-soft">
    <Link href={`/trips/${trip.slug}`} className="relative block aspect-[1.18] overflow-hidden">
      <img src={trip.image} alt={`${trip.title} in ${trip.destination}`} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/65 via-transparent to-transparent" />
      <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-ink">{trip.category}</div>
      <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between text-white"><div><p className="mb-1 text-xs font-medium text-white/70">{trip.region}</p><h3 className="font-display text-2xl leading-none">{trip.title}</h3></div><span className="grid h-10 w-10 place-items-center rounded-full bg-white text-ink"><ArrowUpRight className="h-4 w-4" /></span></div>
    </Link>
    <div className="p-5">
      <p className="min-h-12 text-sm leading-6 text-ink/60">{trip.blurb}</p>
      <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-ink/60"><span className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-forest" />{trip.destination}</span><span className="flex items-center gap-2"><CalendarDays className="h-3.5 w-3.5 text-forest" />{formatDate(departure.date, { day: "numeric", month: "short" })}</span><span className="flex items-center gap-2"><Users className="h-3.5 w-3.5 text-forest" />{seats} seats left</span><span className="text-right font-semibold text-ink">{trip.duration}</span></div>
      <div className="mt-5 flex items-end justify-between border-t border-ink/10 pt-4"><div><p className="text-[11px] uppercase tracking-[0.14em] text-ink/45">from</p><p className="text-xl font-semibold text-forest">{formatCurrency(trip.price)}<span className="text-xs font-normal text-ink/45"> / person</span></p></div><Link href={`/trips/${trip.slug}`} className="text-sm font-semibold text-forest hover:text-ink">View trip <span aria-hidden>↗</span></Link></div>
    </div>
  </article>;
}

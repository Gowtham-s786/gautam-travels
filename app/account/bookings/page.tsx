import { AccountBookings } from "@/components/account-data";
export const metadata = { title: "My bookings" };
export default function MyBookingsPage() { return <main className="pt-28"><section className="mx-auto max-w-5xl px-5 pb-24 lg:px-8"><p className="eyebrow text-clay">My account</p><h1 className="mt-4 font-display text-5xl tracking-[-.05em]">Your bookings.</h1><AccountBookings /></section></main>; }

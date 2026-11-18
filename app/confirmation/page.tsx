import Link from "next/link";
import { Check, MessageCircle, Save } from "lucide-react";
import { Button } from "@/components/button";

export const metadata = { title: "Seat hold" };

export default async function ConfirmationPage({ searchParams }: { searchParams: Promise<{ reference?: string }> }) {
  const { reference: queryReference } = await searchParams;
  const reference = queryReference || "GT-2026-DEMO01";
  return <main className="pt-28"><section className="mx-auto max-w-2xl px-5 pb-24 text-center lg:px-8">
    <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-saffron/20 text-forest"><Check className="h-9 w-9" /></div>
    <p className="eyebrow mt-8 text-clay">Your trip is taking shape</p>
    <h1 className="mt-4 font-display text-5xl tracking-[-.05em]">Seat hold created.</h1>
    <p className="mx-auto mt-5 max-w-md text-base leading-7 text-ink/60">Your seats are held for 10 minutes. Online payment is not connected yet, so no money has been charged and this is not a confirmed booking.</p>
    <div className="mt-9 rounded-[1.75rem] bg-forest p-7 text-white"><p className="eyebrow text-white/50">Booking reference</p><p className="mt-3 text-3xl font-semibold tracking-[.08em]">{reference}</p><p className="mt-3 text-xs text-white/50">Keep this reference if you contact the Gautam Travels team.</p></div>
    <div className="mt-6 grid gap-3 text-left sm:grid-cols-2"><div className="rounded-2xl bg-white p-4"><MessageCircle className="h-4 w-4 text-forest" /><p className="mt-5 text-sm font-semibold">Need help?</p><p className="mt-1 text-xs leading-5 text-ink/50">Our team can answer questions about your hold.</p></div><div className="rounded-2xl bg-white p-4"><Save className="h-4 w-4 text-forest" /><p className="mt-5 text-sm font-semibold">Save this reference</p><p className="mt-1 text-xs leading-5 text-ink/50">Keep it handy while arranging payment with the team.</p></div></div>
    <div className="mt-9 flex flex-wrap justify-center gap-3"><Button href="/trips">Explore more trips</Button><Link href="/contact" className="inline-flex items-center rounded-full border border-ink/15 px-5 py-3 text-sm font-semibold hover:border-forest hover:text-forest">Talk to the team</Link></div>
  </section></main>;
}

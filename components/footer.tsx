import Link from "next/link";
import { Instagram, Mail, Phone } from "lucide-react";
import { Logo } from "./logo";

export function Footer() {
  return <footer className="bg-ink text-white">
    <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[1.5fr_1fr_1fr_1.1fr] lg:px-8">
      <div><Logo light /><p className="mt-6 max-w-xs text-sm leading-7 text-white/60">Thoughtfully planned small-group trips for people who want to go further, together.</p></div>
      <div><p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-saffron">Explore</p><div className="flex flex-col gap-3 text-sm text-white/65"><Link href="/trips" className="hover:text-white">All trips</Link><Link href="/destinations" className="hover:text-white">Destinations</Link><Link href="/about" className="hover:text-white">Our story</Link><Link href="/faq" className="hover:text-white">FAQs</Link></div></div>
      <div><p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-saffron">Good to know</p><div className="flex flex-col gap-3 text-sm text-white/65"><Link href="/contact" className="hover:text-white">Contact us</Link><Link href="/policies/terms" className="hover:text-white">Terms & conditions</Link><Link href="/policies/cancellation" className="hover:text-white">Cancellation policy</Link><Link href="/policies/privacy" className="hover:text-white">Privacy policy</Link></div></div>
      <div><p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-saffron">Say hello</p><div className="flex flex-col gap-4 text-sm text-white/65"><a href="mailto:hello@gautamtravels.in" className="flex items-center gap-3 hover:text-white"><Mail className="h-4 w-4" />hello@gautamtravels.in</a><a href="tel:+918000000000" className="flex items-center gap-3 hover:text-white"><Phone className="h-4 w-4" />+91 80000 00000</a><a href="#" className="flex items-center gap-3 hover:text-white"><Instagram className="h-4 w-4" />@gautamtravels</a></div></div>
    </div>
    <div className="border-t border-white/10"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-2 px-5 py-5 text-xs text-white/40 sm:flex-row lg:px-8"><span>© 2026 Gautam Travels. Built for better weekends.</span><span>Based in Bengaluru · India</span></div></div>
  </footer>;
}

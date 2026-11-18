"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "./logo";
import { Button } from "./button";

const links = [
  ["Trips", "/trips"],
  ["Destinations", "/destinations"],
  ["Our story", "/about"],
  ["FAQs", "/faq"],
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
        <Logo light />
        <nav className="hidden items-center gap-8 lg:flex">
          {links.map(([label, href]) => <Link key={href} href={href} className="text-sm font-medium text-white/80 transition-colors hover:text-white">{label}</Link>)}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/account" className="px-3 text-sm font-medium text-white/80 hover:text-white">My account</Link>
          <Button href="/trips" variant="light" className="px-4 py-2.5">Find a trip</Button>
        </div>
        <button className="rounded-full border border-white/25 p-2 text-white lg:hidden" onClick={() => setOpen(!open)} aria-label="Toggle navigation">{open ? <X /> : <Menu />}</button>
      </div>
      {open && <div className="mx-4 rounded-3xl bg-cream p-5 shadow-soft lg:hidden">
        <div className="flex flex-col gap-1">
          {links.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-sm font-semibold text-ink hover:bg-sand">{label}</Link>)}
          <Link href="/account" onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-sm font-semibold text-ink hover:bg-sand">My account</Link>
          <Button href="/trips" className="mt-2">Find a trip</Button>
        </div>
      </div>}
    </header>
  );
}

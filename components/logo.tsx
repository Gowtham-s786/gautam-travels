import Link from "next/link";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className={`group inline-flex items-center gap-3 ${light ? "text-white" : "text-ink"}`} aria-label="Gautam Travels home">
      <span className={`grid h-10 w-10 place-items-center rounded-full border text-sm font-semibold transition-transform group-hover:rotate-6 ${light ? "border-white/35 bg-white/10" : "border-ink/15 bg-saffron/15"}`}>GT</span>
      <span className="leading-none">
        <span className="block font-display text-[1.45rem] tracking-[-0.04em]">Gautam</span>
        <span className={`block pt-1 text-[0.6rem] font-semibold uppercase tracking-[0.25em] ${light ? "text-white/70" : "text-ink/55"}`}>Travels</span>
      </span>
    </Link>
  );
}

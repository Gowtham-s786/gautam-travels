export function SectionHeading({ eyebrow, title, description, align = "left" }: { eyebrow: string; title: React.ReactNode; description?: string; align?: "left" | "center" }) {
  return <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}><p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-clay">{eyebrow}</p><h2 className="font-display text-4xl leading-[1.03] tracking-[-0.04em] text-ink md:text-5xl">{title}</h2>{description && <p className="mt-5 text-base leading-7 text-ink/60">{description}</p>}</div>;
}

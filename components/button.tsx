import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type ButtonProps = { href?: string; children: React.ReactNode; variant?: "primary" | "light" | "outline"; className?: string; type?: "button" | "submit" };

const styles = {
  primary: "bg-forest text-white hover:bg-ink",
  light: "bg-cream text-ink hover:bg-white",
  outline: "border border-ink/20 text-ink hover:border-forest hover:text-forest",
};

export function Button({ href, children, variant = "primary", className = "", type = "button" }: ButtonProps) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all duration-200 ${styles[variant]} ${className}`;
  if (href) return <Link href={href} className={classes}>{children}<ArrowUpRight className="h-4 w-4" /></Link>;
  return <button type={type} className={classes}>{children}<ArrowUpRight className="h-4 w-4" /></button>;
}

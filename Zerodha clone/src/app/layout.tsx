import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "Northstar | Investing, made clear",
  description: "A brokerage-connected investing experience starter. Paper trading only until an approved broker integration is configured.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}

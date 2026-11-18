import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: "Gautam Travels · Go further, together", template: "%s · Gautam Travels" },
  description: "Small-group trips, treks and weekend escapes from Bengaluru. Thoughtfully planned for people who want to travel well.",
  openGraph: { title: "Gautam Travels · Go further, together", description: "Small-group trips, treks and weekend escapes from Bengaluru.", type: "website" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><Navbar />{children}<Footer /></body></html>;
}

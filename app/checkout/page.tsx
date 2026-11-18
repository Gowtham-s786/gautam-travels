import { CheckoutForm } from "@/components/checkout-form";
import { getTripBySlug } from "@/lib/trips";
import { notFound } from "next/navigation";

export const metadata = { title: "Checkout" };
export const dynamic = "force-dynamic";

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ trip?: string; departure?: string }> }) {
  const query = await searchParams;
  const trip = await getTripBySlug(query.trip || "munnar-mist-trail");
  if (!trip || trip.departures.length === 0) notFound();
  return <CheckoutForm trip={trip} departureId={query.departure} />;
}

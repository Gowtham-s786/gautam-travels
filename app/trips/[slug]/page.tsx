import { notFound } from "next/navigation";
import { TripDetail } from "@/components/trip-detail";
import { getTripBySlug } from "@/lib/trips";

export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const trip = await getTripBySlug(slug); return { title: trip?.title ?? "Trip details", description: trip?.description }; }
export default async function TripPage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const trip = await getTripBySlug(slug); if (!trip) notFound(); return <TripDetail trip={trip} />; }

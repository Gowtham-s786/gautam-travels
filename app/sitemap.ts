import { MetadataRoute } from "next";
import { trips } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap { const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"; return ["", "/trips", "/destinations", "/about", "/contact", "/faq", "/policies/terms", "/policies/cancellation", "/policies/privacy", ...trips.map((trip) => `/trips/${trip.slug}`)].map((path) => ({ url: `${base}${path}`, lastModified: new Date(), changeFrequency: "weekly", priority: path === "" ? 1 : .7 })); }

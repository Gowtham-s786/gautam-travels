import { trips as sampleTrips } from "@/lib/data";
import { Trip, Departure } from "@/lib/types";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";

type DbTrip = {
  id: string; slug: string; code: string; title: string; destination: string; region: string | null;
  category: Trip["category"]; duration_label: string; nights: number; difficulty: Trip["difficulty"];
  cover_image_url: string | null; short_description: string; detailed_description: string;
  highlights: string[]; itinerary: Trip["itinerary"]; inclusions: string[]; exclusions: string[];
  things_to_carry: string[]; faq: Trip["faq"];
};
type DbDeparture = { id: string; trip_id: string; trip_slug: string; starts_on: string; ends_on: string; price_inr: number; seats_total: number; seats_booked: number; seats_available: number; is_active: boolean };

function catalogClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function mapTrip(row: DbTrip, rows: DbDeparture[]): Trip {
  const departures: Departure[] = rows.map((departure) => ({
    id: departure.id,
    date: departure.starts_on,
    returnDate: departure.ends_on,
    price: departure.price_inr,
    seatsTotal: departure.seats_total,
    seatsBooked: departure.seats_total - departure.seats_available,
    status: departure.seats_available === 0 ? "sold-out" : departure.seats_available <= 5 ? "limited" : "open",
  }));
  return {
    slug: row.slug, code: row.code, title: row.title, destination: row.destination,
    region: row.region ?? "India", category: row.category, duration: row.duration_label,
    nights: row.nights, difficulty: row.difficulty, price: departures[0]?.price ?? 0,
    image: row.cover_image_url ?? "/images/trip-placeholder.jpg", accent: "#245443",
    description: row.detailed_description, blurb: row.short_description, departures,
    pickupPoints: [], highlights: row.highlights, itinerary: row.itinerary,
    inclusions: row.inclusions, exclusions: row.exclusions,
    thingsToCarry: row.things_to_carry, faq: row.faq,
  };
}

export async function getTrips(): Promise<Trip[]> {
  if (!isSupabaseConfigured()) return sampleTrips;
  const supabase = catalogClient();
  const [{ data: dbTrips, error: tripsError }, { data: availability, error: departuresError }] = await Promise.all([
    supabase.from("trips").select("*").eq("published", true).order("title"),
    supabase.rpc("get_departure_availability", { p_trip_slug: null }),
  ]);
  if (tripsError) throw new Error(`Unable to load trips: ${tripsError.message}`);
  if (departuresError) throw new Error(`Unable to load departures: ${departuresError.message}`);
  return ((dbTrips ?? []) as DbTrip[]).map((trip) => mapTrip(trip, ((availability ?? []) as DbDeparture[]).filter((departure) => departure.trip_id === trip.id)));
}

export async function getTripBySlug(slug: string): Promise<Trip | undefined> {
  if (!isSupabaseConfigured()) return sampleTrips.find((trip) => trip.slug === slug);
  const supabase = catalogClient();
  const [{ data: dbTrip, error: tripError }, { data: availability, error: departuresError }] = await Promise.all([
    supabase.from("trips").select("*").eq("slug", slug).eq("published", true).maybeSingle(),
    supabase.rpc("get_departure_availability", { p_trip_slug: slug }),
  ]);
  if (tripError) throw new Error(`Unable to load trip: ${tripError.message}`);
  if (departuresError) throw new Error(`Unable to load departures: ${departuresError.message}`);
  if (!dbTrip) return undefined;
  const trip = mapTrip(dbTrip as DbTrip, (availability ?? []) as DbDeparture[]);
  const { data: pickupRows, error: pickupError } = await supabase.from("pickup_points").select("name, departures!inner(trip_id)").eq("departures.trip_id", (dbTrip as DbTrip & { id: string }).id);
  if (pickupError) throw new Error(`Unable to load pickup points: ${pickupError.message}`);
  trip.pickupPoints = [...new Set((pickupRows ?? []).map((row) => row.name))];
  return trip;
}

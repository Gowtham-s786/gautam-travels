import { AdminSection } from "@/components/admin-section";
export const metadata = { title: "Manage trips" };
export default function AdminTripsPage() { return <AdminSection eyebrow="Trips" title="Manage the routes people remember." description="Create trips, publish itineraries and keep every experience ready for the next traveller." items={["Create and edit trip content", "Upload cover images and galleries", "Publish or pause a trip"]} />; }

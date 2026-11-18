import { AdminSection } from "@/components/admin-section";
export const metadata = { title: "Manage bookings" };
export default function AdminBookingsPage() { return <AdminSection eyebrow="Bookings" title="See every booking clearly." description="Search by booking reference, name or phone, then manage status through safe server operations." items={["Search booking references and customer details", "Review pending and confirmed bookings", "Handle cancellation and refund status"]} />; }

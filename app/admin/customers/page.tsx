import { AdminSection } from "@/components/admin-section";
export const metadata = { title: "Manage customers" };
export default function AdminCustomersPage() { return <AdminSection eyebrow="Customers" title="Know the people who travel with you." description="Keep customer profiles useful, private and focused on the support your team needs." items={["View customer profile and booking history", "Update contact records", "Respect customer access boundaries"]} />; }

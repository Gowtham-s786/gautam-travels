import { AdminSection } from "@/components/admin-section";
export const metadata = { title: "Manage enquiries" };
export default function AdminEnquiriesPage() { return <AdminSection eyebrow="Enquiries" title="Turn questions into good plans." description="Keep trip enquiries from slipping through the cracks and follow up with the right context." items={["Review new enquiries", "Assign follow-up status", "Connect an enquiry to a trip"]} />; }

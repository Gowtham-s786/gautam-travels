import { SectionHeading } from "@/components/section-heading";
import { ProfileEditor } from "@/components/account-data";
export const metadata = { title: "Customer profile" };
export default function ProfilePage() { return <main className="pt-28"><section className="mx-auto max-w-4xl px-5 pb-24 lg:px-8"><SectionHeading eyebrow="My account" title={<>A few details<br /><em className="font-normal text-forest">about you.</em></>} description="Keep these details current so your trip updates reach you without a hitch." /><ProfileEditor /></section></main>; }

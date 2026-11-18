import { SectionHeading } from "@/components/section-heading";

export const metadata = { title: "FAQs" };
const faqs = [
  ["How do I book a trip?", "Choose a trip, pick a departure date and complete the checkout form. We hold seats for 10 minutes while you finish payment. Your booking is confirmed once payment is verified."],
  ["Can I join if I am travelling alone?", "Yes. Solo travellers are a big part of our groups. We will place you in the right room configuration and introduce you to the group at the first meeting point."],
  ["What is included in the price?", "Every trip page has an exact inclusions and exclusions list. Transport, accommodation, planned experiences and meals vary by trip, so we keep this clear rather than hiding it in fine print."],
  ["What happens if I need to cancel?", "Cancellation terms depend on how close the trip is. Read the cancellation policy before booking, and contact us as soon as plans change so we can help with the available options."],
  ["How are seats and bookings managed?", "The booking system temporarily holds seats during checkout and confirms them only after the payment is verified. Sold-out departures cannot be selected."],
  ["Can you plan a private or corporate trip?", "Yes. Send us a few details through the enquiry form and we will come back with route, group-size and budget options."],
];

export default function FAQPage() { return <main className="pt-28"><section className="mx-auto max-w-4xl px-5 pb-24 lg:px-8"><SectionHeading eyebrow="Questions, answered" title={<>Good to know<br /><em className="font-normal text-forest">before you go.</em></>} description="If you cannot find what you are looking for, send us a note. A real person will get back to you." /><div className="mt-12 space-y-3">{faqs.map(([question, answer]) => <details key={question} className="group rounded-3xl bg-white p-6 shadow-sm"><summary className="cursor-pointer list-none pr-8 text-base font-semibold">{question}<span className="float-right text-xl font-normal text-forest transition group-open:rotate-45">+</span></summary><p className="mt-4 max-w-2xl text-sm leading-7 text-ink/60">{answer}</p></details>)}</div></section></main>; }

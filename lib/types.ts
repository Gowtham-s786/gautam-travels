export type TripCategory = "Weekend escape" | "Trek" | "Culture" | "Coastal";
export type Difficulty = "Easy" | "Easy to moderate" | "Moderate";

export type Departure = {
  id: string;
  date: string;
  returnDate: string;
  price: number;
  seatsTotal: number;
  seatsBooked: number;
  status: "open" | "limited" | "sold-out";
};

export type Trip = {
  slug: string;
  code: string;
  title: string;
  destination: string;
  region: string;
  category: TripCategory;
  duration: string;
  nights: number;
  difficulty: Difficulty;
  price: number;
  image: string;
  accent: string;
  description: string;
  blurb: string;
  departures: Departure[];
  pickupPoints: string[];
  highlights: string[];
  itinerary: { day: string; title: string; description: string }[];
  inclusions: string[];
  exclusions: string[];
  thingsToCarry: string[];
  faq: { question: string; answer: string }[];
};

export type Booking = {
  reference: string;
  tripSlug: string;
  departureId: string;
  travellerCount: number;
  pickupPoint: string;
  customer: { name: string; email: string; phone: string };
  subtotal: number;
  discount: number;
  total: number;
  status: "pending" | "confirmed" | "failed" | "cancelled";
  paymentStatus: "unpaid" | "paid" | "failed" | "refunded";
  createdAt: string;
};

export type Enquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  tripSlug?: string;
  travellers?: number;
  preferredDate?: string;
  message: string;
  status: "new" | "in-progress" | "resolved";
  createdAt: string;
};

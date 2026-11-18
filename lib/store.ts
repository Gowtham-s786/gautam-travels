import { Booking, Enquiry } from "./types";

const globalStore = globalThis as typeof globalThis & { __gautamBookings?: Booking[]; __gautamEnquiries?: Enquiry[] };

export const bookingStore = globalStore.__gautamBookings ?? (globalStore.__gautamBookings = []);
export const enquiryStore = globalStore.__gautamEnquiries ?? (globalStore.__gautamEnquiries = []);

export const createReference = () => `GT-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

export const storeSummary = () => ({
  totalBookings: bookingStore.length + 48,
  confirmedBookings: bookingStore.filter((b) => b.status === "confirmed").length + 42,
  pendingBookings: bookingStore.filter((b) => b.status === "pending").length + 6,
  revenue: bookingStore.reduce((sum, booking) => sum + booking.total, 0) + 482300,
  newEnquiries: enquiryStore.filter((e) => e.status === "new").length + 8,
});

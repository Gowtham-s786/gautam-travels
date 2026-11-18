import { z } from "zod";

export const bookingSchema = z.object({
  tripSlug: z.string().min(1),
  departureId: z.string().min(1),
  travellerCount: z.number().int().min(1).max(12),
  pickupPoint: z.string().min(2),
  customer: z.object({
    name: z.string().min(2).max(80),
    email: z.string().email(),
    phone: z.string().min(10).max(15),
  }),
  coupon: z.string().max(24).optional(),
});

export const enquirySchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  phone: z.string().min(10).max(15),
  tripSlug: z.string().optional(),
  travellers: z.number().int().min(1).max(50).optional(),
  preferredDate: z.string().optional(),
  message: z.string().min(10).max(1000),
});

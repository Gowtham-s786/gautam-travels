# Gautam Travels

A responsive travel booking website for small group trips and weekend getaways from Bengaluru, built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

- Public home, trip catalog, trip detail, destinations, about, FAQ, contact, and policy pages.
- Trip and departure listings loaded from Supabase, including live seat availability and pickup points.
- Customer registration, sign in, password recovery, profile, and booking views through Supabase Auth.
- Coupon validation, transactional seat holds, and enquiry storage in Supabase.
- Row Level Security policies for customer data and admin-only data access.
- Admin route protection and an overview dashboard backed by live Supabase totals.
- SEO metadata, sitemap, and robots rules.

## Run locally

Requirements: Node.js 20 or later and pnpm.

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

The local `.env.local` file contains the connected Supabase project settings. For another environment, copy `.env.example` to `.env.local` and fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` from Supabase Project Settings → API. Keep `.env.local` and any secret keys out of Git.

## Supabase setup

The initial migration is in `supabase/migrations/20261118093648_gautam_travels_initial.sql` and has already been applied to the connected project. Its version matches the migration recorded in Supabase. It creates the tables, RLS policies, auth profile trigger, coupon and availability functions, booking hold function, and starter catalog data.

To give an account admin access:

1. Register that account from `/account/register` and complete email confirmation if enabled.
2. In the Supabase SQL Editor, add its Auth user ID to the admin allowlist:

```sql
insert into public.admin_users (user_id)
select id from auth.users where lower(email) = lower('your-admin-email@example.com')
on conflict (user_id) do nothing;
```

The account can then sign in and open `/admin`. The dashboard reads booking, captured payment, enquiry, and departure data. Trip, booking, customer, and enquiry management pages are still placeholders.

## Launch work remaining

- Review the sample trip copy, images, prices, dates, and coupon in the Supabase tables before publishing for customers.
- Connect a payment provider. Checkout currently creates a 10-minute seat hold and does not collect money or confirm payment.
- Add transactional email/SMS, rate limiting, monitoring, storage, and the production domain and redirect URLs.
- Build the trip, booking, customer, and enquiry management actions in the admin workspace.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public site origin |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key |
| `RAZORPAY_KEY_ID` | Reserved for future payment setup |
| `RAZORPAY_KEY_SECRET` | Reserved for future server-side payment setup |
| `RAZORPAY_WEBHOOK_SECRET` | Reserved for future payment webhook verification |

Never put a Supabase secret/service-role key in a `NEXT_PUBLIC_` variable or commit it to Git.

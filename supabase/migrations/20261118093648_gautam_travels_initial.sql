-- Gautam Travels schema. Apply only to the dedicated Gautam Travels project.
create extension if not exists pgcrypto;

do $$ begin
  create type public.booking_status as enum ('pending', 'confirmed', 'failed', 'cancelled', 'refunded');
exception when duplicate_object then null; end $$;
do $$ begin
  create type public.payment_status as enum ('created', 'authorized', 'captured', 'failed', 'refunded');
exception when duplicate_object then null; end $$;
do $$ begin
  create type public.enquiry_status as enum ('new', 'in_progress', 'resolved');
exception when duplicate_object then null; end $$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.trips (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  code text not null,
  title text not null,
  destination text not null,
  region text,
  category text not null,
  duration_label text not null,
  nights integer not null default 0 check (nights >= 0),
  difficulty text not null default 'Easy',
  cover_image_url text,
  short_description text not null,
  detailed_description text not null,
  highlights text[] not null default '{}',
  itinerary jsonb not null default '[]',
  inclusions text[] not null default '{}',
  exclusions text[] not null default '{}',
  things_to_carry text[] not null default '{}',
  faq jsonb not null default '[]',
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.departures (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  starts_on date not null,
  ends_on date not null,
  price_inr integer not null check (price_inr >= 0),
  seats_total integer not null check (seats_total > 0),
  seats_booked integer not null default 0 check (seats_booked >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (trip_id, starts_on),
  check (ends_on >= starts_on),
  check (seats_booked <= seats_total)
);

create table public.pickup_points (
  id uuid primary key default gen_random_uuid(),
  departure_id uuid not null references public.departures(id) on delete cascade,
  name text not null,
  pickup_time time,
  sort_order integer not null default 0,
  unique (departure_id, name)
);

create table public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  discount_type text not null check (discount_type in ('percentage', 'fixed')),
  discount_value integer not null check (discount_value > 0),
  minimum_booking_inr integer not null default 0 check (minimum_booking_inr >= 0),
  maximum_discount_inr integer check (maximum_discount_inr is null or maximum_discount_inr >= 0),
  starts_at timestamptz,
  expires_at timestamptz,
  usage_limit integer check (usage_limit is null or usage_limit > 0),
  per_customer_limit integer not null default 1 check (per_customer_limit > 0),
  trip_id uuid references public.trips(id) on delete cascade,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  reference text unique not null default ('GT-' || to_char(now(), 'YYYY') || '-' || upper(substr(encode(gen_random_bytes(6), 'hex'), 1, 10))),
  departure_id uuid not null references public.departures(id),
  customer_id uuid references public.profiles(id) on delete set null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  pickup_point_id uuid references public.pickup_points(id),
  traveller_count integer not null check (traveller_count > 0 and traveller_count <= 12),
  coupon_id uuid references public.coupons(id),
  subtotal_inr integer not null check (subtotal_inr >= 0),
  discount_inr integer not null default 0 check (discount_inr >= 0),
  total_inr integer not null check (total_inr >= 0),
  status public.booking_status not null default 'pending',
  hold_expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.booking_travellers (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  full_name text not null,
  age integer check (age is null or age between 0 and 120),
  created_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  provider text not null default 'razorpay',
  provider_order_id text unique,
  provider_payment_id text unique,
  amount_inr integer not null check (amount_inr >= 0),
  status public.payment_status not null default 'created',
  webhook_event_id text unique,
  refund_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.coupon_usages (
  id uuid primary key default gen_random_uuid(),
  coupon_id uuid not null references public.coupons(id),
  booking_id uuid not null unique references public.bookings(id) on delete cascade,
  customer_id uuid references public.profiles(id) on delete set null,
  customer_email text not null,
  created_at timestamptz not null default now(),
  unique (coupon_id, booking_id)
);

create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  trip_id uuid references public.trips(id) on delete set null,
  travellers integer check (travellers is null or travellers between 1 and 50),
  preferred_date date,
  message text not null check (char_length(message) between 10 and 1000),
  status public.enquiry_status not null default 'new',
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  booking_id uuid references public.bookings(id) on delete cascade,
  channel text not null check (channel in ('email', 'sms', 'in_app')),
  subject text not null,
  body text not null,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create index departures_trip_date_idx on public.departures(trip_id, starts_on) where is_active;
create index bookings_departure_hold_idx on public.bookings(departure_id, status, hold_expires_at);
create index bookings_customer_idx on public.bookings(customer_id, created_at desc);
create index bookings_email_idx on public.bookings(lower(customer_email));
create index payments_booking_idx on public.payments(booking_id, created_at desc);
create index enquiries_status_idx on public.enquiries(status, created_at desc);

create or replace function public.create_profile_for_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id) values (new.id) on conflict (id) do nothing;
  return new;
end;
$$;
revoke all on function public.create_profile_for_auth_user() from public, anon, authenticated;
create trigger on_auth_user_created_profile
  after insert on auth.users
  for each row execute function public.create_profile_for_auth_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admin_users where user_id = (select auth.uid()));
$$;
revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

create or replace function public.get_departure_availability(p_trip_slug text default null)
returns table (
  id uuid,
  trip_id uuid,
  trip_slug text,
  starts_on date,
  ends_on date,
  price_inr integer,
  seats_total integer,
  seats_booked integer,
  seats_available integer,
  is_active boolean
)
language sql
stable
security definer
set search_path = ''
as $$
  select d.id, d.trip_id, t.slug, d.starts_on, d.ends_on, d.price_inr,
    d.seats_total, d.seats_booked,
    greatest(d.seats_total - d.seats_booked - coalesce(sum(b.traveller_count) filter (
      where b.status = 'pending' and b.hold_expires_at > now()
    ), 0)::integer, 0) as seats_available,
    d.is_active
  from public.departures d
  join public.trips t on t.id = d.trip_id
  left join public.bookings b on b.departure_id = d.id
  where t.published and d.is_active and (p_trip_slug is null or t.slug = p_trip_slug)
  group by d.id, d.trip_id, t.slug
  order by d.starts_on;
$$;
revoke all on function public.get_departure_availability(text) from public;
grant execute on function public.get_departure_availability(text) to anon, authenticated;

create or replace function public.validate_booking_coupon(
  p_departure_id uuid,
  p_travellers integer,
  p_coupon_code text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_departure public.departures;
  v_coupon public.coupons;
  v_subtotal integer;
  v_discount integer;
  v_used integer;
begin
  if p_travellers < 1 or p_travellers > 12 then
    return jsonb_build_object('valid', false, 'message', 'Choose between 1 and 12 travellers.');
  end if;
  select d.* into v_departure from public.departures d
    join public.trips t on t.id = d.trip_id
    where d.id = p_departure_id and d.is_active and t.published;
  if not found then return jsonb_build_object('valid', false, 'message', 'Departure is unavailable.'); end if;
  v_subtotal := v_departure.price_inr * p_travellers;
  select c.* into v_coupon from public.coupons c
    where upper(c.code) = upper(trim(p_coupon_code)) and c.is_active
      and (c.starts_at is null or c.starts_at <= now())
      and (c.expires_at is null or c.expires_at > now())
      and (c.trip_id is null or c.trip_id = v_departure.trip_id);
  if not found then return jsonb_build_object('valid', false, 'message', 'Coupon is invalid or expired.'); end if;
  if v_subtotal < v_coupon.minimum_booking_inr then
    return jsonb_build_object('valid', false, 'message', 'Booking does not meet the coupon minimum.');
  end if;
  select count(*)::integer into v_used from public.coupon_usages u where u.coupon_id = v_coupon.id;
  if v_coupon.usage_limit is not null and v_used >= v_coupon.usage_limit then
    return jsonb_build_object('valid', false, 'message', 'Coupon usage limit has been reached.');
  end if;
  v_discount := case when v_coupon.discount_type = 'percentage'
    then round(v_subtotal * v_coupon.discount_value / 100.0)::integer
    else v_coupon.discount_value end;
  if v_coupon.maximum_discount_inr is not null then v_discount := least(v_discount, v_coupon.maximum_discount_inr); end if;
  v_discount := least(v_discount, v_subtotal);
  return jsonb_build_object('valid', true, 'discount_inr', v_discount, 'subtotal_inr', v_subtotal, 'total_inr', v_subtotal - v_discount);
end;
$$;
revoke all on function public.validate_booking_coupon(uuid, integer, text) from public;
grant execute on function public.validate_booking_coupon(uuid, integer, text) to anon, authenticated;

create or replace function public.create_booking_hold(
  p_departure_id uuid,
  p_travellers integer,
  p_pickup_point text,
  p_customer_name text,
  p_customer_email text,
  p_customer_phone text,
  p_coupon_code text default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_departure public.departures;
  v_coupon public.coupons;
  v_pickup_id uuid;
  v_customer_id uuid := (select auth.uid());
  v_subtotal integer;
  v_discount integer := 0;
  v_available integer;
  v_used integer;
  v_customer_used integer;
  v_booking public.bookings;
begin
  if p_travellers < 1 or p_travellers > 12 then raise exception 'traveller count must be between 1 and 12'; end if;
  if char_length(trim(p_customer_name)) < 2 or char_length(trim(p_customer_name)) > 80 then raise exception 'invalid customer name'; end if;
  if char_length(trim(p_customer_email)) > 254 or position('@' in p_customer_email) < 2 then raise exception 'invalid customer email'; end if;
  if char_length(trim(p_customer_phone)) < 10 or char_length(trim(p_customer_phone)) > 16 then raise exception 'invalid customer phone'; end if;

  select d.* into v_departure from public.departures d
    join public.trips t on t.id = d.trip_id
    where d.id = p_departure_id and d.is_active and t.published
    for update of d;
  if not found then raise exception 'departure unavailable'; end if;

  update public.bookings set status = 'cancelled', updated_at = now()
    where departure_id = p_departure_id and status = 'pending' and hold_expires_at <= now();
  select pp.id into v_pickup_id from public.pickup_points pp
    where pp.departure_id = p_departure_id and pp.name = trim(p_pickup_point);
  if v_pickup_id is null then raise exception 'pickup point unavailable'; end if;

  select v_departure.seats_total - v_departure.seats_booked - coalesce(sum(b.traveller_count), 0)::integer
    into v_available from public.bookings b
    where b.departure_id = p_departure_id and b.status = 'pending' and b.hold_expires_at > now();
  if v_available < p_travellers then raise exception 'not enough seats'; end if;
  v_subtotal := v_departure.price_inr * p_travellers;

  if nullif(trim(p_coupon_code), '') is not null then
    select c.* into v_coupon from public.coupons c
      where upper(c.code) = upper(trim(p_coupon_code)) and c.is_active
        and (c.starts_at is null or c.starts_at <= now())
        and (c.expires_at is null or c.expires_at > now())
        and (c.trip_id is null or c.trip_id = v_departure.trip_id)
      for update;
    if not found then raise exception 'coupon invalid or expired'; end if;
    if v_subtotal < v_coupon.minimum_booking_inr then raise exception 'coupon minimum not met'; end if;
    select count(*)::integer into v_used from public.coupon_usages u where u.coupon_id = v_coupon.id;
    select v_used + count(*)::integer into v_used from public.bookings b
      where b.coupon_id = v_coupon.id and b.status = 'pending' and b.hold_expires_at > now();
    if v_coupon.usage_limit is not null and v_used >= v_coupon.usage_limit then raise exception 'coupon usage limit reached'; end if;
    select count(*)::integer into v_customer_used from public.coupon_usages u
      where u.coupon_id = v_coupon.id and lower(u.customer_email) = lower(trim(p_customer_email));
    select v_customer_used + count(*)::integer into v_customer_used from public.bookings b
      where b.coupon_id = v_coupon.id and lower(b.customer_email) = lower(trim(p_customer_email))
        and b.status = 'pending' and b.hold_expires_at > now();
    if v_customer_used >= v_coupon.per_customer_limit then raise exception 'coupon customer limit reached'; end if;
    v_discount := case when v_coupon.discount_type = 'percentage'
      then round(v_subtotal * v_coupon.discount_value / 100.0)::integer
      else v_coupon.discount_value end;
    if v_coupon.maximum_discount_inr is not null then v_discount := least(v_discount, v_coupon.maximum_discount_inr); end if;
    v_discount := least(v_discount, v_subtotal);
  end if;

  insert into public.bookings (
    departure_id, customer_id, customer_name, customer_email, customer_phone,
    pickup_point_id, traveller_count, coupon_id, subtotal_inr, discount_inr,
    total_inr, status, hold_expires_at
  ) values (
    p_departure_id, v_customer_id, trim(p_customer_name), lower(trim(p_customer_email)), trim(p_customer_phone),
    v_pickup_id, p_travellers, v_coupon.id, v_subtotal, v_discount,
    v_subtotal - v_discount, 'pending', now() + interval '10 minutes'
  ) returning * into v_booking;

  return jsonb_build_object(
    'id', v_booking.id, 'reference', v_booking.reference, 'status', v_booking.status,
    'subtotal', v_booking.subtotal_inr, 'discount', v_booking.discount_inr,
    'total', v_booking.total_inr, 'holdExpiresAt', v_booking.hold_expires_at
  );
end;
$$;
revoke all on function public.create_booking_hold(uuid, integer, text, text, text, text, text) from public;
grant execute on function public.create_booking_hold(uuid, integer, text, text, text, text, text) to anon, authenticated;

create or replace function public.confirm_booking_payment(
  p_booking_id uuid,
  p_provider text,
  p_provider_order_id text,
  p_provider_payment_id text,
  p_webhook_event_id text,
  p_amount_inr integer
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_booking public.bookings;
  v_existing public.payments;
begin
  select * into v_booking from public.bookings where id = p_booking_id for update;
  if not found then raise exception 'booking not found'; end if;
  select * into v_existing from public.payments
    where provider_payment_id = p_provider_payment_id or webhook_event_id = p_webhook_event_id;
  if found then
    if v_existing.booking_id <> p_booking_id or v_existing.amount_inr <> p_amount_inr then raise exception 'payment event mismatch'; end if;
    return jsonb_build_object('reference', v_booking.reference, 'status', v_booking.status, 'paymentStatus', v_existing.status);
  end if;
  if v_booking.status = 'confirmed' then raise exception 'booking already confirmed'; end if;
  if v_booking.status <> 'pending' or v_booking.hold_expires_at <= now() then raise exception 'booking hold expired'; end if;
  if p_amount_inr <> v_booking.total_inr then raise exception 'payment amount mismatch'; end if;
  insert into public.payments (booking_id, provider, provider_order_id, provider_payment_id, amount_inr, status, webhook_event_id)
    values (p_booking_id, p_provider, p_provider_order_id, p_provider_payment_id, p_amount_inr, 'captured', p_webhook_event_id);
  update public.bookings set status = 'confirmed', updated_at = now() where id = p_booking_id returning * into v_booking;
  update public.departures set seats_booked = seats_booked + v_booking.traveller_count where id = v_booking.departure_id;
  if v_booking.coupon_id is not null then
    insert into public.coupon_usages (coupon_id, booking_id, customer_id, customer_email)
      values (v_booking.coupon_id, v_booking.id, v_booking.customer_id, v_booking.customer_email)
      on conflict (coupon_id, booking_id) do nothing;
  end if;
  return jsonb_build_object('reference', v_booking.reference, 'status', v_booking.status, 'paymentStatus', 'captured');
end;
$$;
revoke all on function public.confirm_booking_payment(uuid, text, text, text, text, integer) from public, anon, authenticated;
grant execute on function public.confirm_booking_payment(uuid, text, text, text, text, integer) to service_role;

alter table public.profiles enable row level security;
alter table public.admin_users enable row level security;
alter table public.trips enable row level security;
alter table public.departures enable row level security;
alter table public.pickup_points enable row level security;
alter table public.coupons enable row level security;
alter table public.bookings enable row level security;
alter table public.booking_travellers enable row level security;
alter table public.payments enable row level security;
alter table public.coupon_usages enable row level security;
alter table public.enquiries enable row level security;
alter table public.notifications enable row level security;

create policy "published trips are public" on public.trips for select to anon, authenticated using (published);
create policy "admins manage trips" on public.trips for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "active departures for published trips are public" on public.departures for select to anon, authenticated using (is_active and exists (select 1 from public.trips t where t.id = trip_id and t.published));
create policy "admins manage departures" on public.departures for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "pickup points for active public trips" on public.pickup_points for select to anon, authenticated using (exists (select 1 from public.departures d join public.trips t on t.id = d.trip_id where d.id = departure_id and d.is_active and t.published));
create policy "admins manage pickup points" on public.pickup_points for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "customers read own profile" on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "customers update own profile" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy "admins read profiles" on public.profiles for select to authenticated using ((select public.is_admin()));
create policy "customers read own bookings" on public.bookings for select to authenticated using ((select auth.uid()) = customer_id);
create policy "admins manage bookings" on public.bookings for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "customers read own booking travellers" on public.booking_travellers for select to authenticated using (exists (select 1 from public.bookings b where b.id = booking_id and b.customer_id = (select auth.uid())));
create policy "admins manage booking travellers" on public.booking_travellers for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "customers read own payments" on public.payments for select to authenticated using (exists (select 1 from public.bookings b where b.id = booking_id and b.customer_id = (select auth.uid())));
create policy "admins read payments" on public.payments for select to authenticated using ((select public.is_admin()));
create policy "admins manage coupons" on public.coupons for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admins read coupon usages" on public.coupon_usages for select to authenticated using ((select public.is_admin()));
create policy "public may submit enquiries" on public.enquiries for insert to anon, authenticated with check (char_length(trim(name)) between 2 and 80 and char_length(trim(email)) between 5 and 254 and char_length(trim(phone)) between 10 and 16 and char_length(trim(message)) between 10 and 1000);
create policy "admins manage enquiries" on public.enquiries for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "customers read own notifications" on public.notifications for select to authenticated using ((select auth.uid()) = user_id);
create policy "admins manage notifications" on public.notifications for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

grant select on public.trips, public.departures, public.pickup_points to anon, authenticated;
grant select, insert, update, delete on public.trips, public.departures, public.pickup_points to authenticated;
grant select, update (full_name, phone, updated_at) on public.profiles to authenticated;
grant select on public.bookings, public.booking_travellers, public.payments, public.notifications to authenticated;
grant select, insert, update, delete on public.bookings, public.booking_travellers, public.payments, public.coupons, public.coupon_usages, public.enquiries, public.notifications to authenticated;
grant insert on public.enquiries to anon, authenticated;

-- Public starter catalog: replace dates, prices, copy, and operating details before taking live bookings.
insert into public.trips (slug, code, title, destination, region, category, duration_label, nights, difficulty, cover_image_url, short_description, detailed_description, highlights, itinerary, inclusions, exclusions, things_to_carry, faq, published)
values
('munnar-mist-trail','MM','Munnar Mist Trail','Munnar, Kerala','Western Ghats','Weekend escape','3 days',2,'Easy','https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1400&q=85','Tea country, cloud forests and a slower kind of weekend.','A restorative escape through Munnar tea estates, quiet valleys and highland viewpoints.','{"Tea estate sunrise walk","Kolukkumalai viewpoint","Slow mornings in Munnar","Curated local food stops"}', '[{"day":"Day 01","title":"Leave the city behind","description":"Meet your trip lead in Bengaluru, settle into the coach and arrive in Munnar for a sunset tea estate walk."},{"day":"Day 02","title":"Above the clouds","description":"Take the early jeep up to Kolukkumalai, then return through misty viewpoints and a relaxed local lunch."},{"day":"Day 03","title":"A gentle goodbye","description":"Visit Mattupetty Lake and Echo Point before the return journey."}]', '{"AC sleeper coach from Bengaluru","2 nights boutique stay","Daily breakfast","Trip lead and local coordination"}', '{"Lunches and dinners","Personal purchases","Optional jeep upgrades","Travel insurance"}', '{"Comfortable walking shoes","Light rain jacket","Reusable water bottle","Personal medication"}', '[{"question":"Is this suitable for first-time travellers?","answer":"Yes. The pace is relaxed and a trip lead supports the group."},{"question":"What accommodation is included?","answer":"Twin-sharing rooms in a comfortable property close to Munnar town."}]', true),
('hampi-afterglow','HA','Hampi Afterglow','Hampi, Karnataka','Tungabhadra Valley','Culture','2 days',1,'Easy','https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1400&q=85','Ancient stones, river light and the kind of silence you remember.','A compact heritage weekend across Hampi ruins, boulder landscapes and riverfront lanes. Come for the history, stay for golden hour.','{"Virupaksha Temple lanes","Sunset at Hemakuta Hill","Coracle ride on the Tungabhadra","Local thali lunch"}', '[{"day":"Day 01","title":"The city of stones","description":"Explore the riverside bazaar, Virupaksha Temple and Hemakuta Hill before sunset."},{"day":"Day 02","title":"Across the river","description":"Visit the royal centre, take a coracle ride and return to Bengaluru."}]', '{"AC transport from Bengaluru","1 night stay","Breakfast","Local guide","Coracle ride"}', '{"Monument entry fees","Lunches and dinners","Personal purchases","Travel insurance"}', '{"Sun protection","Comfortable sandals","Cotton layers","Small day bag"}', '[{"question":"How much walking is involved?","answer":"Expect 5 to 7 km across uneven paths, with regular breaks."},{"question":"Can I join alone?","answer":"Yes. Solo travellers are welcome."}]', true),
('gokarna-blue-hour','GB','Gokarna Blue Hour','Gokarna, Karnataka','Konkan Coast','Coastal','3 days',2,'Easy to moderate','https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=85','A salt-air weekend of beach walks, temple towns and late sunsets.','Follow the Konkan coast from quiet coves to old temple streets. A beach trip with enough adventure to keep the days moving and room to slow down.','{"Kudle to Om beach walk","Dolphin-spotting boat ride","Gokarna old town","Sunset by the sea"}', '[{"day":"Day 01","title":"Find your shore","description":"Arrive in Gokarna, check in and walk the coastline from Kudle to Om Beach."},{"day":"Day 02","title":"A day in blue","description":"Take a short boat ride, explore quieter beaches and enjoy a coastal lunch."},{"day":"Day 03","title":"The last wave","description":"Visit Gokarna old town and temple lanes before returning to Bengaluru."}]', '{"AC transport from Bengaluru","2 nights stay","Breakfast","Boat ride","Trip lead"}', '{"Beach activities","Lunches and dinners","Personal purchases","Travel insurance"}', '{"Swimwear and quick-dry layers","Sunscreen","Walking sandals","A light backpack"}', '[{"question":"Are the beach walks difficult?","answer":"They are gentle, with some rocky sections. You may skip a walk."},{"question":"Is the boat ride guaranteed?","answer":"It depends on weather and local operating conditions."}]', true),
('kudremukh-greenline','KG','Kudremukh Greenline','Kudremukh, Karnataka','Western Ghats','Trek','2 days',1,'Moderate','https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=85','Rolling grasslands, forest trails and a summit worth the climb.','A guided weekend trek through the Western Ghats, with careful pacing, campfire stories and a view that opens slowly.','{"Guided 14 km trail","Forest and grassland terrain","Campfire evening","Small group of 18"}', '[{"day":"Day 01","title":"Into the green","description":"Travel to the trailhead, meet the local guide and begin a steady climb through forest and grassland."},{"day":"Day 02","title":"The ridge line","description":"Reach the ridge in the morning, then descend together before returning."}]', '{"Transport from Bengaluru","Forest entry and guide fees","Camp stay","Breakfast and dinner","First-aid support"}', '{"Personal snacks","Trekking shoes","Insurance","Weather disruption costs"}', '{"Trekking shoes with grip","Headlamp","Two litres of water","Warm layer and rain cover"}', '[{"question":"How fit do I need to be?","answer":"Be comfortable walking for 6 to 8 hours with breaks."},{"question":"What if the weather changes?","answer":"The local guide may adjust or shorten the route for safety."}]', true);

insert into public.departures (trip_id, starts_on, ends_on, price_inr, seats_total)
select t.id, v.starts_on::date, v.ends_on::date, v.price_inr, v.seats_total
from (values
  ('munnar-mist-trail','2026-12-05','2026-12-07',6890,24),('munnar-mist-trail','2026-12-19','2026-12-21',7290,24),('munnar-mist-trail','2027-01-09','2027-01-11',6890,24),
  ('hampi-afterglow','2026-11-28','2026-11-29',4790,26),('hampi-afterglow','2026-12-12','2026-12-13',4990,26),
  ('gokarna-blue-hour','2026-12-11','2026-12-13',5590,24),('gokarna-blue-hour','2026-12-26','2026-12-28',6290,24),
  ('kudremukh-greenline','2026-12-04','2026-12-05',3890,18),('kudremukh-greenline','2026-12-18','2026-12-19',4090,18)
) as v(slug, starts_on, ends_on, price_inr, seats_total)
join public.trips t on t.slug = v.slug;

insert into public.pickup_points (departure_id, name, sort_order)
select d.id, p.name, p.sort_order
from public.departures d
join public.trips t on t.id = d.trip_id
cross join lateral unnest(case t.slug
  when 'munnar-mist-trail' then array['Koramangala','Indiranagar','Yeshwanthpur']
  when 'hampi-afterglow' then array['Silk Board','Majestic','Hebbal']
  when 'gokarna-blue-hour' then array['Electronic City','Indiranagar','Yeshwanthpur']
  else array['Majestic','Yeshwanthpur'] end) with ordinality as p(name, sort_order);

insert into public.coupons (code, discount_type, discount_value, maximum_discount_inr, minimum_booking_inr, per_customer_limit, is_active)
values ('GOFURTHER','percentage',10,750,0,1,true);

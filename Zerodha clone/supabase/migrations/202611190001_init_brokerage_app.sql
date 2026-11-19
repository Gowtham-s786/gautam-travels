-- Apply only to a dedicated Supabase project for this application.
-- This schema is for app preferences and connection metadata, never balances or authoritative orders.
create extension if not exists pgcrypto;

create table if not exists public.app_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.app_profiles enable row level security;
create policy "Users read own app profile" on public.app_profiles for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users create own app profile" on public.app_profiles for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Users update own app profile" on public.app_profiles for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create table if not exists public.watchlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 40),
  created_at timestamptz not null default now(),
  unique(user_id, name)
);
create index if not exists watchlists_user_created_idx on public.watchlists (user_id, created_at);
alter table public.watchlists enable row level security;
create policy "Users manage own watchlists" on public.watchlists for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create table if not exists public.watchlist_items (
  id uuid primary key default gen_random_uuid(),
  watchlist_id uuid not null references public.watchlists(id) on delete cascade,
  instrument_key text not null check (char_length(instrument_key) between 1 and 80),
  exchange text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique(watchlist_id, instrument_key)
);
create index if not exists watchlist_items_watchlist_sort_idx on public.watchlist_items (watchlist_id, sort_order);
alter table public.watchlist_items enable row level security;
create policy "Users manage items in own watchlists" on public.watchlist_items for all to authenticated
using (exists (select 1 from public.watchlists w where w.id = watchlist_id and w.user_id = (select auth.uid())))
with check (exists (select 1 from public.watchlists w where w.id = watchlist_id and w.user_id = (select auth.uid())));

create table if not exists public.security_audit_events (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete set null,
  event_type text not null check (char_length(event_type) <= 100),
  event_ref text,
  occurred_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);
alter table public.security_audit_events enable row level security;
revoke all on public.security_audit_events from anon, authenticated;

grant select, insert, update on public.app_profiles to authenticated;
grant select, insert, update, delete on public.watchlists to authenticated;
grant select, insert, update, delete on public.watchlist_items to authenticated;
grant usage, select on sequence public.security_audit_events_id_seq to service_role;

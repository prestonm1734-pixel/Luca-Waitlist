-- ============================================================
-- Run this in your Supabase project:
--   Dashboard → SQL Editor → New query → paste → Run
-- ============================================================

create table if not exists public.waitlist (
  id         bigserial primary key,
  email      text not null,
  created_at timestamptz not null default now(),
  source     text not null default 'landing_page'
);

-- Prevent duplicate signups
create unique index if not exists waitlist_email_unique
  on public.waitlist (lower(email));

-- Allow the anon key to insert (no read — keeps emails private)
alter table public.waitlist enable row level security;

create policy "anyone can join waitlist"
  on public.waitlist
  for insert
  to anon
  with check (true);

-- Optional: view your signups (only authenticated users / service role)
-- create policy "owner can read waitlist"
--   on public.waitlist
--   for select
--   to authenticated
--   using (true);

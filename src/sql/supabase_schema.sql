-- Supabase schema for YouPick suggestions and votes
-- Run this in Supabase SQL editor after enabling Anonymous sign-ins in Auth.

create extension if not exists pgcrypto;

create table if not exists suggestions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  text text not null,
  author_name text,
  created_at timestamptz not null default now()
);

alter table suggestions enable row level security;

drop policy if exists suggestions_public_select on suggestions;
drop policy if exists suggestions_allow_insert_any_client on suggestions;
drop policy if exists suggestions_owner_modify on suggestions;
drop policy if exists suggestions_owner_delete on suggestions;

create policy "suggestions_public_select" on suggestions
  for select using (true);

create policy "suggestions_insert_own" on suggestions
  for insert with check (user_id = auth.uid());

create policy "suggestions_update_own" on suggestions
  for update using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "suggestions_delete_own" on suggestions
  for delete using (user_id = auth.uid());

create table if not exists youpick_votes (
  id uuid primary key default gen_random_uuid(),
  poll_id text not null default 'default',
  user_id uuid not null default auth.uid(),
  selections jsonb not null default '{}'::jsonb,
  other_comment text,
  created_at timestamptz not null default now(),
  constraint youpick_votes_unique_per_user_per_poll unique (poll_id, user_id)
);

alter table youpick_votes enable row level security;

drop policy if exists votes_public_select on youpick_votes;
drop policy if exists votes_allow_insert_any_client on youpick_votes;
drop policy if exists votes_owner_upsert on youpick_votes;
drop policy if exists votes_owner_delete on youpick_votes;

create policy "votes_public_select" on youpick_votes
  for select using (true);

create policy "votes_insert_own" on youpick_votes
  for insert with check (user_id = auth.uid());

create policy "votes_update_own" on youpick_votes
  for update using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "votes_delete_own" on youpick_votes
  for delete using (user_id = auth.uid());

-- Anonymous Auth setup:
-- 1) In Supabase Dashboard, enable Anonymous sign-ins under Authentication > Providers.
-- 2) Run this SQL.
-- 3) Frontend signs users in anonymously on first visit and uses auth.uid() for ownership.

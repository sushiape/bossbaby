-- Waitlist subscription attribution.
--
-- Additive (ADR 0009): existing rows take source = 'website' from the default,
-- so the public signup endpoint keeps working unchanged while Staff Import and
-- the one-time Formspree transfer become distinguishable.

alter table public.waitlist_subscriptions
  add column if not exists source text not null default 'website';

alter table public.waitlist_subscriptions
  add column if not exists created_by uuid references auth.users(id) on delete set null;

-- A non-empty lowercase key, so new channels need no schema change.
alter table public.waitlist_subscriptions
  drop constraint if exists waitlist_subscriptions_source_shape;
alter table public.waitlist_subscriptions
  add constraint waitlist_subscriptions_source_shape
    check (source ~ '^[a-z][a-z0-9_]*$');

create index if not exists waitlist_subscriptions_created_at_idx
  on public.waitlist_subscriptions (created_at desc, id desc);

create index if not exists waitlist_subscriptions_email_search_idx
  on public.waitlist_subscriptions (email text_pattern_ops);

comment on column public.waitlist_subscriptions.source is
  'Acquisition channel: website (public signup), staff (Staff Import), legacy_formspree (one-time transfer).';

comment on column public.waitlist_subscriptions.created_by is
  'The staff identity that imported this row. Null for public signups.';

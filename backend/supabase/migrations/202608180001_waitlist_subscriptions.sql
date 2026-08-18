create table if not exists public.waitlist_subscriptions (
  id uuid primary key default extensions.gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now(),
  constraint waitlist_subscriptions_email_normalized
    check (email = lower(btrim(email))),
  constraint waitlist_subscriptions_email_length
    check (char_length(email) between 3 and 320),
  constraint waitlist_subscriptions_email_shape
    check (email like '%_@_%._%')
);

alter table public.waitlist_subscriptions enable row level security;

revoke all on table public.waitlist_subscriptions from public, anon, authenticated;
grant all on table public.waitlist_subscriptions to service_role;

comment on table public.waitlist_subscriptions is
  'Canonical email subscriptions accepted through the public waitlist Edge Function.';

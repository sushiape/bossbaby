-- Local development seed. Never runs against a deployed environment: the
-- Supabase CLI applies this only to the local stack started by `supabase start`.
--
-- Capability grants are made by hand in every real environment (there is no
-- grant API and no UI that writes to these tables). This file exists so a fresh
-- local database can exercise all four Staff Workspace states without anyone
-- hand-rolling a user in Studio.
--
-- Sign in at http://localhost:3000/admin with:
--   staff@example.com  / password123   -> full capabilities
--   viewer@example.com / password123   -> restricted_app.access only (My Access only)
--   reader@example.com / password123   -> waitlist.read only (view, cannot change)
--   nobody@example.com / password123   -> no grants (access denied)

-- gen_salt/crypt live in the pgcrypto extension.
create extension if not exists pgcrypto with schema extensions;

-- Deterministic ids keep re-seeding idempotent.
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data, is_sso_user, is_anonymous,
  -- GoTrue scans these into non-nullable Go strings; NULL makes every
  -- sign-in fail with "Database error querying schema".
  confirmation_token, recovery_token, email_change, email_change_token_new
)
values
  ('00000000-0000-0000-0000-000000000000',
   'aaaaaaaa-0000-4000-a000-000000000001', 'authenticated', 'authenticated',
   'staff@example.com', extensions.crypt('password123', extensions.gen_salt('bf')),
   now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', false, false, '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000',
   'aaaaaaaa-0000-4000-a000-000000000002', 'authenticated', 'authenticated',
   'viewer@example.com', extensions.crypt('password123', extensions.gen_salt('bf')),
   now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', false, false, '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000',
   'aaaaaaaa-0000-4000-a000-000000000003', 'authenticated', 'authenticated',
   'nobody@example.com', extensions.crypt('password123', extensions.gen_salt('bf')),
   now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', false, false, '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000',
   'aaaaaaaa-0000-4000-a000-000000000004', 'authenticated', 'authenticated',
   'reader@example.com', extensions.crypt('password123', extensions.gen_salt('bf')),
   now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', false, false, '', '', '', '')
on conflict (id) do nothing;

-- An identity row is required for password sign-in to resolve the user.
insert into auth.identities (
  provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
)
select
  candidate.id::text,
  candidate.id,
  jsonb_build_object('sub', candidate.id::text, 'email', candidate.email, 'email_verified', true),
  'email',
  now(), now(), now()
from auth.users as candidate
where candidate.email in ('staff@example.com', 'viewer@example.com', 'nobody@example.com', 'reader@example.com')
on conflict (provider, provider_id) do nothing;

-- staff@example.com holds every capability in the registry.
insert into public.staff_capability_grants (user_id, capability)
select 'aaaaaaaa-0000-4000-a000-000000000001', registered.name
from public.staff_capabilities as registered
on conflict (user_id, capability) do nothing;

-- viewer@example.com holds only restricted app access: a Staff Member who sees
-- My Access and no Waitlist tab.
insert into public.staff_capability_grants (user_id, capability)
values ('aaaaaaaa-0000-4000-a000-000000000002', 'restricted_app.access')
on conflict (user_id, capability) do nothing;

-- reader@example.com can view the waitlist but not change it: Import and Remove
-- must be absent from the UI, and the function must refuse them regardless.
insert into public.staff_capability_grants (user_id, capability)
values ('aaaaaaaa-0000-4000-a000-000000000004', 'waitlist.read')
on conflict (user_id, capability) do nothing;

-- nobody@example.com deliberately receives no grants: an App User, refused with 403.

-- Sample waitlist subscriptions for local development, spread across the three
-- acquisition channels and backdated so ordering and paging are visible.
insert into public.waitlist_subscriptions (email, source, created_at, created_by)
select
  sample.email,
  sample.source,
  now() - (sample.age_days || ' days')::interval,
  case when sample.source = 'staff'
       then 'aaaaaaaa-0000-4000-a000-000000000001'::uuid end
from (values
  ('ada.lovelace@example.com',      'website',          1),
  ('grace.hopper@example.com',      'website',          2),
  ('katherine.johnson@example.com', 'website',          3),
  ('joan.clarke@example.com',       'website',          4),
  ('hedy.lamarr@example.com',       'website',          5),
  ('radia.perlman@example.com',     'website',          6),
  ('barbara.liskov@example.com',    'website',          7),
  ('frances.allen@example.com',     'website',          8),
  ('margaret.hamilton@example.com', 'website',          9),
  ('carol.shaw@example.com',        'website',         10),
  ('sophie.wilson@example.com',     'website',         11),
  ('lynn.conway@example.com',       'website',         12),
  ('erna.hoover@example.com',       'website',         13),
  ('evelyn.boyd@example.com',       'website',         14),
  ('mary.wilkes@example.com',       'website',         15),
  ('adele.goldberg@example.com',    'staff',           16),
  ('jean.bartik@example.com',       'staff',           17),
  ('kathleen.booth@example.com',    'staff',           18),
  ('marlyn.meltzer@example.com',    'staff',           19),
  ('ruth.teitelbaum@example.com',   'staff',           20),
  ('betty.holberton@example.com',   'legacy_formspree', 21),
  ('frances.spence@example.com',    'legacy_formspree', 22),
  ('kay.mcnulty@example.com',       'legacy_formspree', 23),
  ('anita.borg@example.com',        'legacy_formspree', 24),
  ('shafi.goldwasser@example.com',  'legacy_formspree', 25)
) as sample(email, source, age_days)
on conflict (email) do nothing;

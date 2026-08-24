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
where candidate.email in ('staff@example.com', 'viewer@example.com', 'nobody@example.com')
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

-- nobody@example.com deliberately receives no grants: an App User, refused with 403.

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
--   reader@example.com / password123   -> waitlist.read + surveys.read (view, cannot change)
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
--
-- surveys.read is granted explicitly rather than left to the backfill in
-- migration 202609030001. That backfill runs when the migration is applied,
-- which is BEFORE this seed creates the grant it reads from -- so relying on it
-- here would leave reader without the Surveys tab. The migration's rule is
-- still the right one for real environments, where waitlist.read already
-- exists when it runs.
insert into public.staff_capability_grants (user_id, capability)
values
  ('aaaaaaaa-0000-4000-a000-000000000004', 'waitlist.read'),
  ('aaaaaaaa-0000-4000-a000-000000000004', 'surveys.read')
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

-- The product fit survey is NOT seeded here. Migration 202608270001 inserts it,
-- because the landing page has nowhere to send answers until the row exists in
-- every environment. Duplicating the question set here would mean editing a
-- prompt in two places with nothing catching the drift, so the responses below
-- reference the migrated row instead.

-- Responses so local development has something to read back, and enough of
-- them that the Surveys tab shows a real distribution rather than four rows.
-- Every one is complete: all four questions are required, so a response that
-- skipped one could not have been submitted.
--
-- The flavour answers deliberately repeat with inconsistent casing and spacing
-- ("Mango", "mango", " MANGO "). The results view groups case-insensitively on
-- the trimmed string and displays the most common original spelling, and this
-- is the data that proves it rather than a unit test asserting it in the
-- abstract. The one-off long answer is here for the same reason: the tail is
-- what a text question is for, and it must survive into the verbatim list.
--
-- Every size answer is one of 100ml / 150ml / 330ml. The 250ml option was
-- corrected away by migration 202608290001; an answer naming it would be an
-- answer to a question nobody was asked, and the results view drops such
-- values rather than attributing them to an option no participant read.
insert into public.survey_responses (survey_key, participant_id, answers, created_at)
select
  'product_fit_v1',
  sample.participant_id::uuid,
  sample.answers::jsonb,
  now() - (sample.age_days || ' days')::interval
from (values
  ('bbbbbbbb-0000-4000-b000-000000000001',
   '{"gender":"Female","size":"150ml","flavour":"Mango","drinks":["Power Up, Babe","Glow Up, Babe"]}', 1),
  ('bbbbbbbb-0000-4000-b000-000000000002',
   '{"gender":"Female","size":"330ml","flavour":"Passionfruit","drinks":["Just Chill, Babe"]}', 2),
  ('bbbbbbbb-0000-4000-b000-000000000003',
   '{"gender":"Diverse","size":"100ml","flavour":"Elderflower","drinks":["Power Up, Babe"]}', 3),
  ('bbbbbbbb-0000-4000-b000-000000000004',
   '{"gender":"Male","size":"330ml","flavour":"Yuzu","drinks":["Just Chill, Babe"]}', 4),
  ('bbbbbbbb-0000-4000-b000-000000000005',
   '{"gender":"Female","size":"150ml","flavour":"mango","drinks":["Glow Up, Babe"]}', 5),
  ('bbbbbbbb-0000-4000-b000-000000000006',
   '{"gender":"Female","size":"150ml","flavour":" MANGO ","drinks":["Power Up, Babe","Just Chill, Babe"]}', 6),
  ('bbbbbbbb-0000-4000-b000-000000000007',
   '{"gender":"Male","size":"150ml","flavour":"Mango","drinks":["Power Up, Babe"]}', 7),
  ('bbbbbbbb-0000-4000-b000-000000000008',
   '{"gender":"Female","size":"100ml","flavour":"Passionfruit","drinks":["Glow Up, Babe","Just Chill, Babe"]}', 8),
  ('bbbbbbbb-0000-4000-b000-000000000009',
   '{"gender":"Diverse","size":"150ml","flavour":"passionfruit","drinks":["Power Up, Babe"]}', 9),
  ('bbbbbbbb-0000-4000-b000-000000000010',
   '{"gender":"Female","size":"150ml","flavour":"Strawberry","drinks":["Glow Up, Babe"]}', 10),
  ('bbbbbbbb-0000-4000-b000-000000000011',
   '{"gender":"Male","size":"330ml","flavour":"strawberry","drinks":["Just Chill, Babe","Power Up, Babe"]}', 11),
  ('bbbbbbbb-0000-4000-b000-000000000012',
   '{"gender":"Female","size":"150ml","flavour":"Lychee","drinks":["Glow Up, Babe"]}', 12),
  ('bbbbbbbb-0000-4000-b000-000000000013',
   '{"gender":"Diverse","size":"100ml","flavour":"Yuzu","drinks":["Just Chill, Babe"]}', 13),
  ('bbbbbbbb-0000-4000-b000-000000000014',
   '{"gender":"Female","size":"150ml","flavour":"Mango","drinks":["Power Up, Babe","Glow Up, Babe","Just Chill, Babe"]}', 14),
  ('bbbbbbbb-0000-4000-b000-000000000015',
   '{"gender":"Male","size":"150ml","flavour":"something like passionfruit but a lot less sweet","drinks":["Power Up, Babe"]}', 15)
) as sample(participant_id, answers, age_days)
on conflict (survey_key, participant_id) do nothing;

-- A second survey, so the Surveys tab is exercised as a list rather than a
-- single hardcoded row, and so a CLOSED survey is visible: is_open defaults to
-- false and reading a finished survey's results is the main reason the tab
-- exists. Seeded here rather than migrated because it is local scaffolding, not
-- a survey any environment runs.
--
-- Its question set is deliberately shaped unlike product_fit_v1 -- three
-- questions, different keys, an optional text question -- because the dashboard
-- renders whatever question set it is given and this is what proves no
-- survey-specific code crept in. The optional question is the one that makes
-- per-question n differ from the response count.
insert into public.surveys (key, family, title, purpose, questions, is_open, created_at, closes_at)
values (
  'packaging_v1',
  'packaging',
  'Packaging preferences',
  'Local development only. Proves the Surveys tab renders an unfamiliar question set.',
  '[
    {"key":"material","type":"single_choice","prompt":"Which bottle would you rather hold?",
     "options":["Glass","Aluminium","Recycled plastic"],"required":true},
    {"key":"matters","type":"multi_choice","prompt":"What matters when you choose?",
     "options":["Looks","Recyclable","Light to carry","Price"],"required":true},
    {"key":"anything_else","type":"text","prompt":"Anything else?","maxLength":200,"required":false}
  ]'::jsonb,
  false,
  now() - interval '40 days',
  now() - interval '9 days'
)
on conflict (key) do nothing;

-- anything_else is optional, so fewer responses answer it than exist: the
-- per-question n and the response count are different numbers here, which is
-- the case a survey where every question is required cannot show.
insert into public.survey_responses (survey_key, participant_id, answers, created_at)
select
  'packaging_v1',
  sample.participant_id::uuid,
  sample.answers::jsonb,
  now() - (sample.age_days || ' days')::interval
from (values
  ('cccccccc-0000-4000-c000-000000000001',
   '{"material":"Glass","matters":["Looks","Recyclable"],"anything_else":"Please no plastic"}', 12),
  ('cccccccc-0000-4000-c000-000000000002',
   '{"material":"Aluminium","matters":["Light to carry","Price"]}', 13),
  ('cccccccc-0000-4000-c000-000000000003',
   '{"material":"Glass","matters":["Looks"],"anything_else":"please no plastic"}', 14),
  ('cccccccc-0000-4000-c000-000000000004',
   '{"material":"Glass","matters":["Recyclable","Looks"]}', 15),
  ('cccccccc-0000-4000-c000-000000000005',
   '{"material":"Recycled plastic","matters":["Price"]}', 16),
  ('cccccccc-0000-4000-c000-000000000006',
   '{"material":"Aluminium","matters":["Light to carry","Recyclable"],"anything_else":"A smaller cap would help"}', 17)
) as sample(participant_id, answers, age_days)
on conflict (survey_key, participant_id) do nothing;

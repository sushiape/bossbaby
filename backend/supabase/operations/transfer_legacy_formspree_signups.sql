-- BBDEV-25: one-time transfer of the Formspree signups into Supabase.
--
-- Not a migration. Migrations are committed to git forever, and these are real
-- subscriber addresses: putting them in one would publish personal data to
-- everyone with repository access, permanently and unretractably.
--
-- The addresses arrive at runtime instead, as :list — a newline-, comma-, or
-- semicolon-separated string supplied by the release workflow from a GitHub
-- secret. This file contains no personal data and is safe to commit.
--
-- Idempotent: safe to run on every deploy. An empty list transfers nothing, and
-- anyone already on the waitlist is skipped rather than duplicated.

with candidate as (
  select lower(btrim(entry)) as email
  from unnest(regexp_split_to_array(:'list', '[\s,;]+')) as entry
  where btrim(entry) <> ''
),
-- The table's constraints would abort the whole statement on one bad address,
-- so anything malformed is filtered out here instead.
valid as (
  select email from candidate
  where email like '%_@_%._%'
    and char_length(email) between 3 and 320
),
inserted as (
  insert into public.waitlist_subscriptions (email, source)
  select email, 'legacy_formspree' from valid
  -- First-touch attribution: an existing subscriber keeps their original
  -- source and join date.
  on conflict (email) do nothing
  returning 1
)
-- Counts only. The addresses themselves must never reach the build log.
select
  (select count(*) from candidate) as supplied,
  (select count(*) from valid) as valid,
  (select count(*) from inserted) as transferred;

-- Survey results become readable in the Staff Workspace.
--
-- Expand phase (ADR 0009): a new capability and nothing else. No table, column,
-- or grant that exists today changes behaviour, so this deploys independently
-- of the Edge Function and the frontend that read it.
--
-- Why a capability of its own rather than reusing waitlist.read: survey answers
-- and waitlist addresses are different data classes. A waitlist row is a
-- consented email address carrying a deletion obligation; a survey response is
-- an anonymous opinion. Bundling them would mean survey access could not be
-- granted without also handing over the email list, which is the coupling the
-- named-capability registry exists to prevent.
--
-- Read only. Opening and closing a survey stays a SQL job for now; a
-- surveys.manage capability is the clean follow-up if that friction bites.

insert into public.staff_capabilities (name, description) values
  ('surveys.read', 'View survey results and individual responses.')
on conflict (name) do update set description = excluded.description;

-- Backfill, mirroring how 202608240001 seeded staff_capability_grants from the
-- legacy allowlist: everyone already trusted with the waitlist gets survey
-- results, so nobody loses a view they had on the day this deploys.
--
-- Deliberately NOT every staff identity. An identity holding only
-- restricted_app.access has no staff data access today, and a blanket backfill
-- would quietly hand it survey answers.
--
-- granted_by stays null because no staff identity performed these grants.
insert into public.staff_capability_grants (user_id, capability)
select grant_row.user_id, 'surveys.read'
from public.staff_capability_grants as grant_row
where grant_row.capability = 'waitlist.read'
on conflict (user_id, capability) do nothing;

revoke all on table public.suggestions from anon, authenticated;
revoke all on table public.youpick_votes from anon, authenticated;
revoke execute on function public.is_valid_youpick_selections(jsonb) from anon, authenticated;

drop policy if exists suggestions_public_select on public.suggestions;
drop policy if exists suggestions_insert_own on public.suggestions;
drop policy if exists suggestions_delete_own on public.suggestions;
drop policy if exists votes_public_select on public.youpick_votes;
drop policy if exists votes_insert_own on public.youpick_votes;
drop policy if exists votes_update_own on public.youpick_votes;

-- Emergency cutover recovery (audit before manual use; never automate):
-- Reapply grants/policies from 202608120001_foundation.sql only while rolling back
-- to the legacy frontend, then ship a forward-fix migration restoring lockdown.

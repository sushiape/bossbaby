-- Staff Workspace capability registry.
--
-- Expand phase (ADR 0009). This migration adds the canonical capability registry
-- and makes it authoritative for new work, while leaving the existing
-- restricted_app_developers allowlist fully operational. Nothing that works
-- today changes behavior.

create table if not exists public.staff_capabilities (
  name text primary key,
  description text not null,
  created_at timestamptz not null default now(),
  constraint staff_capabilities_name_shape
    check (name ~ '^[a-z][a-z0-9_]*\.[a-z][a-z0-9_]*$'),
  constraint staff_capabilities_description_length
    check (char_length(btrim(description)) between 1 and 300)
);

alter table public.staff_capabilities enable row level security;
revoke all on table public.staff_capabilities from public, anon, authenticated;
grant all on table public.staff_capabilities to service_role;

comment on table public.staff_capabilities is
  'Canonical registry of named staff capabilities. Replaces numeric access levels.';

insert into public.staff_capabilities (name, description) values
  ('restricted_app.access',   'Use the unreleased Bossbaby application before launch.'),
  ('waitlist.read',           'View waitlist subscriptions and communication history.'),
  ('waitlist.manage',         'Add and permanently remove waitlist subscriptions.'),
  ('communications.draft',    'Create and edit communication drafts.'),
  ('communications.send',     'Send communications to waitlist subscriptions.')
on conflict (name) do update set description = excluded.description;

create table if not exists public.staff_capability_grants (
  user_id uuid not null references auth.users(id) on delete cascade,
  capability text not null references public.staff_capabilities(name),
  granted_at timestamptz not null default now(),
  granted_by uuid references auth.users(id) on delete set null,
  primary key (user_id, capability)
);

alter table public.staff_capability_grants enable row level security;
revoke all on table public.staff_capability_grants from public, anon, authenticated;
grant all on table public.staff_capability_grants to service_role;

create index if not exists staff_capability_grants_user_id_idx
  on public.staff_capability_grants (user_id);

comment on table public.staff_capability_grants is
  'Which identity holds which capability. Granted manually; absence of a row is revocation.';

-- Backfill: every currently enabled developer receives the equivalent capability.
-- granted_by stays null because no staff identity performed these grants.
insert into public.staff_capability_grants (user_id, capability)
select developer.user_id, 'restricted_app.access'
from public.restricted_app_developers as developer
where developer.enabled
on conflict (user_id, capability) do nothing;

-- Authoritative capability check for all new Staff Workspace work.
create or replace function public.has_staff_capability(requested_capability text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.staff_capability_grants as grant_row
    where grant_row.user_id = (select auth.uid())
      and grant_row.capability = requested_capability
  );
$$;

revoke all on function public.has_staff_capability(text) from public, anon, authenticated;
grant execute on function public.has_staff_capability(text) to authenticated, service_role;

comment on function public.has_staff_capability(text) is
  'Returns whether the current authenticated identity holds one named capability.';

-- DEPRECATED compatibility boundary.
--
-- The separately deployed Restricted App still calls this. It keeps working and
-- keeps returning the same answers: it now reads the capability registry UNION
-- the original allowlist, so an identity provisioned through either path is
-- still authorized. The union is what makes this migration safe to deploy
-- without coordinating a release with bossbabyremix.
--
-- Converted from `language sql` to `plpgsql` solely so it can emit a
-- deprecation warning into the Postgres logs on every call. The returned value
-- is unchanged.
create or replace function public.is_restricted_app_developer()
returns boolean
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  authorized boolean;
begin
  raise warning 'DEPRECATED: is_restricted_app_developer() is scheduled for removal. Call has_staff_capability(%) instead and provision developers through public.staff_capability_grants. See docs/app-integration-contract.md.', quote_literal('restricted_app.access');

  select
    exists (
      select 1
      from public.staff_capability_grants as grant_row
      where grant_row.user_id = (select auth.uid())
        and grant_row.capability = 'restricted_app.access'
    )
    or exists (
      select 1
      from public.restricted_app_developers as developer
      where developer.user_id = (select auth.uid())
        and developer.enabled
    )
  into authorized;

  return authorized;
end;
$$;

revoke all on function public.is_restricted_app_developer() from public, anon, authenticated;
grant execute on function public.is_restricted_app_developer() to authenticated, service_role;

comment on function public.is_restricted_app_developer() is
  'DEPRECATED, scheduled for removal. Use has_staff_capability(''restricted_app.access''). '
  'Reads the capability registry union the legacy allowlist so both provisioning paths work '
  'during the transition.';

comment on table public.restricted_app_developers is
  'DEPRECATED, scheduled for removal. Superseded by public.staff_capability_grants. '
  'Still read by is_restricted_app_developer() during the transition; do not add new rows.';

create table if not exists public.restricted_app_developers (
  user_id uuid primary key references auth.users(id) on delete cascade,
  enabled boolean not null default true,
  label text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint restricted_app_developers_label_length
    check (label is null or char_length(btrim(label)) between 1 and 120)
);

alter table public.restricted_app_developers enable row level security;

revoke all on table public.restricted_app_developers from public, anon, authenticated;
grant all on table public.restricted_app_developers to service_role;

comment on table public.restricted_app_developers is
  'Server-controlled allowlist for pre-release access to the Restricted App.';

create or replace function public.is_restricted_app_developer()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.restricted_app_developers as developer
    where developer.user_id = (select auth.uid())
      and developer.enabled
  );
$$;

revoke all on function public.is_restricted_app_developer() from public, anon, authenticated;
grant execute on function public.is_restricted_app_developer() to authenticated, service_role;

comment on function public.is_restricted_app_developer() is
  'Returns only the current authenticated identity''s Restricted App authorization state.';

create table if not exists public.restricted_app_entry_attempts (
  source_hash text primary key,
  attempts integer not null,
  window_started_at timestamptz not null,
  constraint restricted_app_entry_attempts_source_hash
    check (source_hash ~ '^[0-9a-f]{64}$'),
  constraint restricted_app_entry_attempts_count
    check (attempts between 1 and 5)
);

alter table public.restricted_app_entry_attempts enable row level security;
revoke all on table public.restricted_app_entry_attempts from public, anon, authenticated;
grant all on table public.restricted_app_entry_attempts to service_role;

create or replace function public.consume_restricted_app_entry_attempt(
  requested_source_hash text
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_attempts integer;
  current_window timestamptz;
begin
  if requested_source_hash !~ '^[0-9a-f]{64}$' then
    return false;
  end if;

  delete from public.restricted_app_entry_attempts
  where window_started_at < now() - interval '1 day';

  insert into public.restricted_app_entry_attempts (source_hash, attempts, window_started_at)
  values (requested_source_hash, 1, now())
  on conflict (source_hash) do nothing
  returning attempts, window_started_at
  into current_attempts, current_window;

  if found then
    return true;
  end if;

  select attempts, window_started_at
  into current_attempts, current_window
  from public.restricted_app_entry_attempts
  where source_hash = requested_source_hash
  for update;

  if current_window <= now() - interval '15 minutes' then
    update public.restricted_app_entry_attempts
    set attempts = 1, window_started_at = now()
    where source_hash = requested_source_hash;
    return true;
  end if;

  if current_attempts >= 5 then
    return false;
  end if;

  update public.restricted_app_entry_attempts
  set attempts = attempts + 1
  where source_hash = requested_source_hash;
  return true;
end;
$$;

revoke all on function public.consume_restricted_app_entry_attempt(text)
  from public, anon, authenticated;
grant execute on function public.consume_restricted_app_entry_attempt(text)
  to anon, authenticated, service_role;

comment on table public.restricted_app_entry_attempts is
  'Short-lived HMAC source counters for the Restricted App invitation endpoint; no submitted values are stored.';

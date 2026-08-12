create extension if not exists pgcrypto with schema extensions;

create or replace function public.is_valid_youpick_selections(value jsonb)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select
    jsonb_typeof(value) = 'object'
    and not exists (
      select 1 from jsonb_object_keys(value) as key
      where key not in ('pack', 'flavour')
    )
    and jsonb_typeof(coalesce(value -> 'pack', '[]'::jsonb)) = 'array'
    and jsonb_typeof(coalesce(value -> 'flavour', '[]'::jsonb)) = 'array'
    and jsonb_array_length(coalesce(value -> 'pack', '[]'::jsonb)) <= 1
    and (
      jsonb_array_length(coalesce(value -> 'pack', '[]'::jsonb))
      + jsonb_array_length(coalesce(value -> 'flavour', '[]'::jsonb))
    ) > 0
    and not exists (
      select 1 from jsonb_array_elements(coalesce(value -> 'pack', '[]'::jsonb)) as item
      where jsonb_typeof(item) <> 'string'
        or item #>> '{}' not in (
          '100 ml Bottle · A concentrated daily shot',
          '250 ml Bottle · A small functional drink',
          '200 ml Can · Cute, compact, concentrated',
          '250 ml Can · More to sip, still sleek'
        )
    )
    and not exists (
      select 1 from jsonb_array_elements(coalesce(value -> 'flavour', '[]'::jsonb)) as item
      where jsonb_typeof(item) <> 'string'
        or item #>> '{}' not in (
          'Mixed Berries',
          'Mango Peach',
          'Blueberry Coconut',
          'Vanilla Cream',
          'Other: Adding to Suggestions'
        )
    );
$$;

revoke all on function public.is_valid_youpick_selections(jsonb) from public;
grant execute on function public.is_valid_youpick_selections(jsonb) to anon, authenticated, service_role;

create table public.suggestions (
  id uuid primary key default extensions.gen_random_uuid(),
  user_id uuid not null,
  text text not null,
  author_name text not null,
  created_at timestamptz not null default now(),
  constraint suggestions_text_length check (char_length(btrim(text)) between 1 and 500),
  constraint suggestions_author_name_length check (char_length(btrim(author_name)) between 1 and 60)
);

create index suggestions_newest_idx on public.suggestions (created_at desc, id desc);

create table public.youpick_votes (
  id uuid primary key default extensions.gen_random_uuid(),
  poll_id text not null default 'default',
  user_id uuid not null,
  selections jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint youpick_votes_unique_per_user_per_poll unique (poll_id, user_id),
  constraint youpick_votes_poll_id check (poll_id = 'default'),
  constraint youpick_votes_valid_selections check (public.is_valid_youpick_selections(selections))
);

alter table public.suggestions enable row level security;
alter table public.youpick_votes enable row level security;

-- Temporary compatibility grants for an already-deployed direct-access frontend.
-- The next migration removes them after the Edge Function switch.
grant select, insert, delete on public.suggestions to anon, authenticated;
grant select, insert, update on public.youpick_votes to anon, authenticated;
grant all on public.suggestions to service_role;
grant all on public.youpick_votes to service_role;

create policy suggestions_public_select on public.suggestions for select using (true);
create policy suggestions_insert_own on public.suggestions for insert with check (user_id = auth.uid());
create policy suggestions_delete_own on public.suggestions for delete using (user_id = auth.uid());
create policy votes_public_select on public.youpick_votes for select using (true);
create policy votes_insert_own on public.youpick_votes for insert with check (user_id = auth.uid());
create policy votes_update_own on public.youpick_votes for update using (user_id = auth.uid()) with check (user_id = auth.uid());

create or replace function public.get_youpick_vote_results(
  requested_poll_id text default 'default',
  participant_id uuid default null
)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'pollId', requested_poll_id,
    'totalParticipants', count(*),
    'participantHasVoted', coalesce(bool_or(v.user_id = participant_id), false),
    'counts', jsonb_build_object(
      'pack', jsonb_build_object(
        '100 ml Bottle · A concentrated daily shot', count(*) filter (where v.selections -> 'pack' ? '100 ml Bottle · A concentrated daily shot'),
        '250 ml Bottle · A small functional drink', count(*) filter (where v.selections -> 'pack' ? '250 ml Bottle · A small functional drink'),
        '200 ml Can · Cute, compact, concentrated', count(*) filter (where v.selections -> 'pack' ? '200 ml Can · Cute, compact, concentrated'),
        '250 ml Can · More to sip, still sleek', count(*) filter (where v.selections -> 'pack' ? '250 ml Can · More to sip, still sleek')
      ),
      'flavour', jsonb_build_object(
        'Mixed Berries', count(*) filter (where v.selections -> 'flavour' ? 'Mixed Berries'),
        'Mango Peach', count(*) filter (where v.selections -> 'flavour' ? 'Mango Peach'),
        'Blueberry Coconut', count(*) filter (where v.selections -> 'flavour' ? 'Blueberry Coconut'),
        'Vanilla Cream', count(*) filter (where v.selections -> 'flavour' ? 'Vanilla Cream'),
        'Other: Adding to Suggestions', count(*) filter (where v.selections -> 'flavour' ? 'Other: Adding to Suggestions')
      )
    )
  )
  from public.youpick_votes as v
  where v.poll_id = requested_poll_id;
$$;

revoke all on function public.get_youpick_vote_results(text, uuid) from public, anon, authenticated;
grant execute on function public.get_youpick_vote_results(text, uuid) to service_role;

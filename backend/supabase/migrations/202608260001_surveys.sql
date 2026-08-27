-- Surveys and survey responses.
--
-- Additive (ADR 0009): nothing here touches youpick_votes or suggestions. The
-- You Pick poll keeps its own tables and its hardcoded option lists; this is
-- the general shape every survey after it uses.
--
-- The division of labour: surveys.questions is structured because code reads
-- it, survey_responses.answers is opaque because nothing does. See ADR 0017 --
-- the opacity is only safe while questions stay immutable.
--
-- Email is not a survey answer. An address is collected by the waitlist
-- endpoint alongside the survey, never through it.

create table if not exists public.surveys (
  key         text primary key,
  family      text not null,
  supersedes  text references public.surveys(key),
  title       text not null,
  purpose     text,
  questions   jsonb not null,
  is_open     boolean not null default false,
  created_at  timestamptz not null default now(),
  closes_at   timestamptz,
  constraint surveys_key_shape check (key ~ '^[a-z][a-z0-9_]*$'),
  constraint surveys_family_shape check (family ~ '^[a-z][a-z0-9_]*$'),
  constraint surveys_supersedes_not_self check (supersedes is distinct from key),
  constraint surveys_questions_is_array check (jsonb_typeof(questions) = 'array'),
  constraint surveys_questions_not_empty check (jsonb_array_length(questions) > 0),
  constraint surveys_title_length check (char_length(btrim(title)) between 1 and 200)
);

create index if not exists surveys_family_idx on public.surveys (family, created_at desc);

-- A CHECK constraint may not contain a subquery, so the key count is counted
-- here instead. Immutable: the same object always yields the same count.
create or replace function public.jsonb_object_key_count(value jsonb)
returns integer
language sql
immutable
set search_path = ''
as $fn$
  select count(*)::integer from jsonb_object_keys(value);
$fn$;

-- The key-count CHECK on survey_responses calls this, so the role that writes
-- responses must be able to execute it or every insert fails with a permission
-- error from inside the constraint.
revoke all on function public.jsonb_object_key_count(jsonb) from public;
grant execute on function public.jsonb_object_key_count(jsonb) to service_role;

create table if not exists public.survey_responses (
  id             uuid primary key default extensions.gen_random_uuid(),
  survey_key     text not null references public.surveys(key),
  participant_id uuid not null,
  answers        jsonb not null,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  -- Resubmitting replaces, as a You Pick vote does.
  constraint survey_responses_unique_per_participant unique (survey_key, participant_id),
  -- Structural only, never per-survey: a bound on what a public anonymous
  -- endpoint can be made to store, that no future question shape can trip on.
  constraint survey_responses_answers_is_object check (jsonb_typeof(answers) = 'object'),
  constraint survey_responses_answers_key_count check (
    public.jsonb_object_key_count(answers) <= 100
  ),
  constraint survey_responses_answers_size check (pg_column_size(answers) <= 16384)
);

create index if not exists survey_responses_survey_idx
  on public.survey_responses (survey_key, created_at desc);

-- Editing a live survey's questions would orphan every response already given
-- against them. A new question set is a new survey row that supersedes the old
-- one, so a response always points at the exact wording it answered.
create or replace function public.freeze_survey_questions()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.questions is distinct from old.questions
     and exists (select 1 from public.survey_responses where survey_key = old.key)
  then
    raise exception
      'Survey % has responses; insert a superseding survey instead of editing its questions.', old.key
      using errcode = 'restrict_violation';
  end if;
  return new;
end;
$$;

drop trigger if exists surveys_freeze_questions on public.surveys;
create trigger surveys_freeze_questions
  before update on public.surveys
  for each row execute function public.freeze_survey_questions();

-- The Edge Function is the only way in (ADR 0008, ADR 0010).
alter table public.surveys enable row level security;
revoke all on table public.surveys from public, anon, authenticated;
grant all on table public.surveys to service_role;

alter table public.survey_responses enable row level security;
revoke all on table public.survey_responses from public, anon, authenticated;
grant all on table public.survey_responses to service_role;

revoke all on function public.freeze_survey_questions() from public;

comment on table public.surveys is
  'One immutable question set. Editing questions means inserting a new row that supersedes this one.';

comment on column public.surveys.family is
  'Shared across every version of one survey, so responses can be pooled without walking supersedes.';

comment on column public.surveys.supersedes is
  'The survey this one replaces. Null for the first version. Holds the ordering that family alone loses.';

comment on column public.surveys.questions is
  'Question definitions the Edge Function renders and validates every submission against. Each carries a key, a type (single_choice, multi_choice, text), a prompt, and for the choice types its options.';

comment on table public.survey_responses is
  'One participant''s answers to one survey. Resubmitting with the same participant_id replaces, so a client retry cannot double-count.';

comment on column public.survey_responses.answers is
  'Opaque to the database by design (ADR 0017). Cannot hold an email: no question type accepts one, and a consented address belongs in waitlist_subscriptions, where Waitlist Removal can delete it.';

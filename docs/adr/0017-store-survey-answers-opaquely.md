# Store survey answers opaquely

A Survey Response holds its answers as one `jsonb` object the database never
looks inside. Nothing declares what keys it has or what their values mean. This
sits beside `surveys.questions`, which is `jsonb` the Edge Function very much
does read — it is how a question knows it is a single choice and what options it
offers. Two columns in one feature, one structured and one deliberately not, is
the part that looks like an oversight and is not.

The two have different readers. A `surveys` row is written once by a developer
and read by code on every render and every submission, so structure earns its
keep. An `answers` blob is written by an anonymous participant and read by a
human deciding what to build next. Giving it a schema would mean the schema has
to change whenever a survey asks something new — a migration per survey, which
is the cost this whole design exists to remove. The team wants to run many short
surveys without a developer in the loop; opacity is what makes a new survey an
`insert` rather than a deploy.

What that gives up is real. Results cannot be aggregated in SQL: counting how
many people chose one option means reading the question set to learn what key
that survey used, then a hand-written `jsonb` query. The You Pick poll took the
other road — `is_valid_youpick_selections` names all four pack sizes and all
five flavours in a database function — and buys per-question validation at the
price of a migration to change a word. That trade is right for one long-running
poll whose results are shown publicly, and wrong for a series of throwaway ones.
You Pick keeps its tables and is not migrated into this shape.

## The structure lives in the Edge Function, not in SQL

Because the database takes answers as an opaque object, `validateSubmission` is
the *only* thing standing between a submission and storage. It re-reads the
stored question set on every submit and checks each answer against it: a choice
must be one of that question's `options`, a `required` question must be
answered, text is length-clamped. Crucially it iterates the question set rather
than the submitted body, and refuses any key the survey does not ask. The
frontend is not trusted at all — editing the form in the browser, or POSTing by
hand, reaches exactly the same checks. That is what keeps an opaque blob
explainable: it can only ever contain keys its question set defines.

The question set itself is not validated on write. A malformed one commits
cleanly and surfaces as a 500 on read, logged for staff rather than shown to the
participant. Question sets are written by developers, so this is a fault, not a
bad request — but it does mean the first person to meet a typo'd question set is
a participant, and the log is the only signal. Accepted for now; a staff
authoring endpoint reusing `parseQuestions` is the fix if it starts to bite.

## Opacity depends on immutable question sets

An orphaned blob is harmless while the exact wording that produced it is still
in the database, unedited; it becomes unreadable the moment someone rewrites a
live survey's questions in place. So editing questions means inserting a new
survey row that supersedes the old one, and a trigger refuses an in-place edit
once responses exist. `family` groups the versions, `supersedes` orders them.

This is also why an option is a bare string and the answer stores that string.
A `{ value, label }` split would let the label drift from what the participant
actually read, which is the failure the immutability rule exists to prevent.
Fixing a typo in an option therefore costs a superseding survey. That is the
correct price.

Anyone who later relaxes that trigger to allow edits will silently destroy the
meaning of every response already collected, and no constraint elsewhere will
catch it. That dependency is the reason this ADR exists.

## Email is not a survey answer

A survey asks its questions and nothing else. There is no `email` question type,
and no mechanism for an answer to be written anywhere but the response blob. An
address kept only in a blob would be consent the Staff Workspace cannot see and
Waitlist Removal cannot delete, which the waitlist's no-suppressed-state rule
does not survive — so the blob is simply never given the chance to hold one.

An earlier draft of this design let a question declare `writes_to`, and the
surveys function routed that answer into `waitlist_subscriptions` itself. It was
removed. `POST /waitlist/subscriptions` already does that job, and the routing
duplicated its upsert semantics in a second place while making the invariant
above depend on an author remembering to add a field. Where a flow collects both
— four questions and an address behind one button — the frontend makes two
calls: the survey first, then the waitlist.

Two calls means no transaction, so either half can fail alone. Both are
idempotent, which is what makes the recovery simply "submit again": the waitlist
upsert ignores duplicates (preserving the Subscription Source an address first
arrived with), and a survey response upserts on `(survey_key, participant_id)`.
Answers go first because they are what the participant came to give, and a
failed waitlist write can then be retried without risking them.

That retry safety has a client-side dependency worth naming: `participant_id` is
generated by the browser and must be **persisted and reused across retries**. A
client that mints a fresh id per attempt turns a retry into a second response.

## Responses are signal, not votes

`participant_id` is supplied by an anonymous client and verified against nothing
(a signed-in participant's JWT wins, but these surveys do not require sign-in).
Clearing storage, or POSTing fresh uuids in a loop, produces unlimited distinct
"participants". The unique constraint deduplicates honest resubmissions; it is
not an integrity guarantee, and results should never be read as a vote count.
Accepted deliberately: these surveys inform what to build, and the friction of
proof-of-humanity is not worth it at this stage. Revisit if a survey's outcome
ever decides something contested.

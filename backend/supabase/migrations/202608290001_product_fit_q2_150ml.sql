-- Correct Q2 of the product fit survey: the middle size is 150 ml, not 250 ml.
--
-- BBDEV-40 supersedes the option list its parent ticket described. Nothing in
-- the frontend changes: the popup renders whatever question set the surveys
-- endpoint publishes, so the correction is entirely this row.
--
-- This edits a live survey's questions in place, which the surveys table
-- otherwise forbids -- a new question set is normally a new row that supersedes
-- the old one (ADR 0017), and surveys_freeze_questions enforces that as soon as
-- a response exists. It is allowed exactly here because the only response
-- against product_fit_v1 was a smoke test submitted three minutes after the
-- survey was inserted, so no answer anyone gave is being reinterpreted.
--
-- Do not take this as the pattern for the next correction. Once real responses
-- exist the freeze trigger is right and the answer is a superseding row.

-- Scoped to before the correction rather than to the whole survey, so a real
-- response arriving between this migration being written and being applied
-- survives -- and then trips the freeze trigger below, failing the deploy
-- instead of silently rewriting the question someone answered.
delete from public.survey_responses
 where survey_key = 'product_fit_v1'
   and created_at < timestamptz '2026-08-29 00:00:00+00';

-- Addressed by question key rather than array position: the questions array is
-- ordered for display, and a later reordering must not silently retarget this.
update public.surveys as s
   set questions = (
         select jsonb_agg(
                  case
                    when question ->> 'key' = 'size'
                      then jsonb_set(question, '{options}', '["100ml", "150ml", "330ml"]'::jsonb)
                    else question
                  end
                  order by ordinality
                )
           from jsonb_array_elements(s.questions) with ordinality as t(question, ordinality)
       )
 where s.key = 'product_fit_v1';

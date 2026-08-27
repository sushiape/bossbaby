-- The first survey: product fit.
--
-- Every survey after this one is a plain insert (ADR 0017) -- the whole point
-- of storing answers opaquely is that a new question set costs no migration.
-- This one is different only because it is bootstrap: the landing page asks for
-- family 'product_fit' and has nowhere to send answers until a row exists, so
-- the row has to arrive in every environment the same way the schema does.
--
-- Email is absent by design. The fifth thing the popup asks for is an address,
-- but it is not a Question: the frontend posts it to the waitlist endpoint in a
-- second call, where Waitlist Removal can reach it.
--
-- Every question is required. The answers decide what gets produced, so a
-- half-filled response is worth little; the email is required for the same
-- reason, which keeps the form's strictness consistent rather than gating on
-- the one field the ticket described most casually.
--
-- Wording and options are the ticket's (BBDEV-38) verbatim, including the
-- title case of the drink names -- they are product names, and they are frozen
-- into every answer stored against this survey.

insert into public.surveys (key, family, title, purpose, questions, is_open)
values (
  'product_fit_v1',
  'product_fit',
  'Five questions. Then we build your drink.',
  'What people would actually buy, before flavours, sizes and audience are fixed.',
  '[
    {
      "key": "gender",
      "type": "single_choice",
      "prompt": "I am...",
      "options": ["Female", "Male", "Diverse"],
      "required": true
    },
    {
      "key": "size",
      "type": "single_choice",
      "prompt": "I would like to buy...",
      "options": ["100ml", "250ml", "330ml"],
      "required": true
    },
    {
      "key": "flavour",
      "type": "text",
      "prompt": "Flavour I love...",
      "maxLength": 120,
      "required": true
    },
    {
      "key": "drinks",
      "type": "multi_choice",
      "prompt": "Which drink would you look forward to most?",
      "hint": "Pick as many as you like.",
      "options": ["Power Up, Babe", "Glow Up, Babe", "Just Chill, Babe"],
      "required": true
    }
  ]'::jsonb,
  true
)
-- Re-running a migration must not trip the freeze trigger, which only guards
-- updates. Doing nothing is also what keeps a superseding survey inserted later
-- from being clobbered by a replay of this one.
on conflict (key) do nothing;

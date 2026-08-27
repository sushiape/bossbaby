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
      "options": ["Female", "Male", "Diverse"]
    },
    {
      "key": "size",
      "type": "single_choice",
      "prompt": "I would like to buy...",
      "options": ["100ml", "250ml", "330ml"]
    },
    {
      "key": "flavour",
      "type": "text",
      "prompt": "Flavour I love...",
      "maxLength": 120
    },
    {
      "key": "drinks",
      "type": "multi_choice",
      "prompt": "Which drink would you look forward to the most?",
      "hint": "Pick as many as you like.",
      "options": ["Power up, Babe", "Glow up, Babe", "Just chill, Babe"]
    }
  ]'::jsonb,
  true
)
-- Re-running a migration must not trip the freeze trigger, which only guards
-- updates. Doing nothing is also what keeps a superseding survey inserted later
-- from being clobbered by a replay of this one.
on conflict (key) do nothing;

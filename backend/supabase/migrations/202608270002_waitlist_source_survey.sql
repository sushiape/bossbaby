-- The survey joins the waitlist's channel vocabulary.
--
-- No schema change: waitlist_subscriptions.source already accepts any lowercase
-- key, and the allowlist that decides which ones a browser may claim lives in
-- the waitlist Edge Function. Only the column comment was out of date.

comment on column public.waitlist_subscriptions.source is
  'Acquisition channel: website (public signup), survey (collected alongside survey answers), staff (Staff Import), legacy_formspree (one-time transfer).';

# BBDEV-38 — survey style prototypes

Standalone prototypes of the new 5-question survey, for review.
Not wired into the app: nothing here is imported by `frontend/`, and no
answers are sent anywhere. Open any of them directly in a browser.

- `style-a-single-page.html` — landing page first; "Help us build it" opens
  the survey as its own page, all five questions down it, one Submit.
- `style-b-stepped.html` — same landing page, but "Help us build it" opens a
  popup over it, one question at a time, like the quiz already on the site.
- `style-c-auto-popup.html` — **current direction.** Style A's five questions
  inside a popup: one scrollable container filling most of the screen. It opens
  by itself three seconds after load, and "Help us build it" reopens it. The
  landing page behind it uses the real hero content, and the mood finder is
  gone — this survey replaces it.

Style C is where the review landed: all questions visible in one scroll (Style
A's layout) without leaving the landing page (Style B's container).

All three carry the same questions (Q1 gender, Q2 size, Q3 free-text flavour,
Q4 multi-select drink, Q5 email), show "help us build it" instead of
"mood finder", and print the captured answers on the final screen so you
can see what a real submission would collect.

Colours are the site's own palette from `BossBabyLandingPage.jsx`: Poppins,
`#FF89CC` pink, `#FFD6E9` ground, black text and CTAs. The mockups were
read as layout patterns, not copied as artwork. Style C also borrows the
mood finder's *treatment* from the since-deleted `MoodQuizDialog.tsx` — the gradient card,
32px radius and translucent white tiles — so pink reads as an accent
rather than as a flat background.

Style C shipped. These prototypes are kept as the record of the review, not as
anything the site loads; the built version lives in
`frontend/src/pages/BossBabyLandingPage/`, renders its questions from the
backend rather than from hardcoded markup, and really does send answers.

How the open questions resolved:
- Q1–Q4 answers go to `survey_responses` via the surveys Edge Function, and the
  email goes to the waitlist separately in a second call. See ADR 0017 for why
  an address is never a survey answer.
- Q4 stayed as it is, asked up-front. What it measures is which name appeals
  before anyone has tasted anything, which is the question worth asking now.
- The popup opens itself once per visitor. The hero button reopens it
  unconditionally, which is what lets a second person on one device answer.

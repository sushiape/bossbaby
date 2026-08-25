# BBDEV-38 — survey style prototypes

Two standalone prototypes of the new 5-question survey, for review.
Not wired into the app: nothing here is imported by `frontend/`, and no
answers are sent anywhere. Open either file directly in a browser.

- `style-a-single-page.html` — landing page first; "Help us build it" opens
  the survey as its own page, all five questions down it, one Submit.
- `style-b-stepped.html` — same landing page, but "Help us build it" opens a
  popup over it, one question at a time, like the quiz already on the site.

So the choice is really: does the survey get its own page, or stay a popup?

Both carry the same questions (Q1 gender, Q2 size, Q3 free-text flavour,
Q4 multi-select drink, Q5 email), show "help us build it" instead of
"mood finder", and print the captured answers on the final screen so you
can see what a real submission would collect.

Colours are the site's own palette from `BossBabyLandingPage.jsx`: Poppins,
`#FF89CC` pink, `#FFD6E9` ground, black text and CTAs. The mockups were
read as layout patterns, not copied as artwork.

Open questions for BBDEV-38, unchanged by these prototypes:
- Where Q1–Q4 answers get stored (the waitlist API takes only an email).
- Whether Q4 works asked up-front, since users don't yet know the drinks.

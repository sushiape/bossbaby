# BBDEV-38 — survey style prototypes

Two standalone prototypes of the new 5-question survey, for review.
Not wired into the app: nothing here is imported by `frontend/`, and no
answers are sent anywhere. Open either file directly in a browser.

- `style-a-single-page.html` — a full page: all five questions laid out down
  the page, scrolled through, one Submit at the end.
- `style-b-stepped.html` — a popup over a blurred page, one question at a
  time, same shell as the quiz already on the site.

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

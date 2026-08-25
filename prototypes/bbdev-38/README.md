# BBDEV-38 — survey style prototypes

Two standalone prototypes of the new 5-question survey, for review.
Not wired into the app: nothing here is imported by `frontend/`, and no
answers are sent anywhere. Open either file directly in a browser.

- `style-a-single-page.html` — all five questions on one screen, one Submit.
- `style-b-stepped.html` — one question per screen, progress bar, auto-advance.

Both carry the same questions (Q1 gender, Q2 size, Q3 free-text flavour,
Q4 multi-select drink, Q5 email), show "help us build it" instead of
"mood finder", and print the captured answers on the final screen so you
can see what a real submission would collect.

Colours are the Bossbaby palette (Poppins, `#FF89CC` pink, deep plum
`#4e1029`–`#6d1f3d`, amber CTA); the layouts follow the supplied mockups.

Open questions for BBDEV-38, unchanged by these prototypes:
- Where Q1–Q4 answers get stored (the waitlist API takes only an email).
- Whether Q4 works asked up-front, since users don't yet know the drinks.

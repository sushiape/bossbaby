import assert from "node:assert/strict";
import test from "node:test";
import {
  answersForSubmission,
  marksVisitorSeen,
  shouldAutoOpen,
  toggleChoice,
  type SurveyDraft,
} from "./productFitSurvey.ts";
import type { SurveyQuestion } from "../../shared/services/surveysApi.ts";

const questions: SurveyQuestion[] = [
  { key: "gender", type: "single_choice", prompt: "I am...", options: ["Female", "Male"], required: false },
  { key: "flavour", type: "text", prompt: "Flavour I love...", required: false, maxLength: 120 },
  {
    key: "drinks",
    type: "multi_choice",
    prompt: "Which drink?",
    options: ["Power up, Babe", "Glow up, Babe"],
    required: false,
  },
];

test("a single choice replaces the previous one", () => {
  const first = toggleChoice({}, questions[0], "Female");
  assert.deepEqual(first, { gender: "Female" });
  assert.deepEqual(toggleChoice(first, questions[0], "Male"), { gender: "Male" });
});

test("re-picking a single choice clears it, so a mis-tap is undoable", () => {
  const picked = toggleChoice({}, questions[0], "Female");
  assert.deepEqual(toggleChoice(picked, questions[0], "Female"), {});
});

test("a multi choice accumulates and removes without disturbing other answers", () => {
  let draft: SurveyDraft = { gender: "Female" };
  draft = toggleChoice(draft, questions[2], "Power up, Babe");
  draft = toggleChoice(draft, questions[2], "Glow up, Babe");
  assert.deepEqual(draft, { gender: "Female", drinks: ["Power up, Babe", "Glow up, Babe"] });

  draft = toggleChoice(draft, questions[2], "Power up, Babe");
  assert.deepEqual(draft, { gender: "Female", drinks: ["Glow up, Babe"] });
});

test("emptying a multi choice drops the key rather than sending an empty list", () => {
  let draft = toggleChoice({}, questions[2], "Power up, Babe");
  draft = toggleChoice(draft, questions[2], "Power up, Babe");
  assert.deepEqual(draft, {});
});

// validateSubmission iterates the question set and refuses any key it does not
// ask, so a stale draft from a superseded question set has to be dropped here
// rather than posted and rejected.
test("submission keeps only the questions the survey currently asks", () => {
  const draft: SurveyDraft = { gender: "Female", retired: "yes", drinks: ["Glow up, Babe"] };
  assert.deepEqual(answersForSubmission(questions, draft), {
    gender: "Female",
    drinks: ["Glow up, Babe"],
  });
});

test("submission drops blank text rather than sending an empty answer", () => {
  assert.deepEqual(answersForSubmission(questions, { flavour: "   " }), {});
  assert.deepEqual(answersForSubmission(questions, { flavour: "  Mango " }), { flavour: "Mango" });
});

test("the popup opens itself once per visitor and never over an active control", () => {
  assert.equal(shouldAutoOpen({ alreadySeen: false, userIsInteracting: false }), true);
  assert.equal(shouldAutoOpen({ alreadySeen: true, userIsInteracting: false }), false);
  assert.equal(shouldAutoOpen({ alreadySeen: false, userIsInteracting: true }), false);
});

// The flag records that the *timer* has had its one turn. Opening from the hero
// button is an explicit request and must leave that turn unspent, otherwise
// clicking the CTA within the first three seconds silently cancels the auto-open
// the visitor never got.
test("only the timed opening spends the once-per-visitor showing", () => {
  assert.equal(marksVisitorSeen("timer"), true);
  assert.equal(marksVisitorSeen("hero_button"), false);
});

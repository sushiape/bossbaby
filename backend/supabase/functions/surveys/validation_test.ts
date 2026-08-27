import assert from "node:assert/strict";
import { ApiError } from "../_shared/errors.ts";
import { parseQuestions, participantId, validateSubmission } from "./validation.ts";
import type { Question } from "./types.ts";

const QUESTIONS: unknown[] = [
  {
    key: "gender",
    type: "single_choice",
    prompt: "I am...",
    options: ["Female", "Male", "Diverse"],
  },
  {
    key: "size",
    type: "single_choice",
    prompt: "I would like to buy...",
    required: true,
    options: ["100ml", "250ml"],
  },
  { key: "flavour", type: "text", prompt: "Flavour I love...", maxLength: 120 },
  {
    key: "drinks",
    type: "multi_choice",
    prompt: "Which drink?",
    options: ["Power up, Babe", "Glow up, Babe", "Just chill, Babe"],
  },
];

function parsed(): Question[] {
  return parseQuestions(QUESTIONS, "launch_v1");
}

Deno.test("a full submission is stored as opaque answers", () => {
  const { answers } = validateSubmission(parsed(), {
    answers: {
      gender: "Female",
      size: "250ml",
      flavour: "  Mango  ",
      drinks: ["Just chill, Babe", "Power up, Babe"],
    },
  });

  assert.deepEqual(answers, {
    gender: "Female",
    size: "250ml",
    flavour: "Mango",
    // Reordered to the question set, so counting later does not depend on the client.
    drinks: ["Power up, Babe", "Just chill, Babe"],
  });
});

Deno.test("an email is never accepted as a survey answer", () => {
  // Email lives on the waitlist, never in a response blob (ADR 0017). There is
  // no question type that could carry one, and an unasked key is refused.
  assert.throws(
    () => validateSubmission(parsed(), { answers: { size: "250ml", email: "a@b.co" } }),
    ApiError,
  );
  assert.throws(
    () => parseQuestions([{ key: "email", type: "email", prompt: "?" }], "broken"),
    (error: unknown) => error instanceof ApiError && error.status === 500,
  );
});

Deno.test("an unknown option is refused rather than stored", () => {
  assert.throws(
    () => validateSubmission(parsed(), { answers: { gender: "Other", size: "250ml" } }),
    ApiError,
  );
  assert.throws(
    () =>
      validateSubmission(parsed(), {
        answers: { drinks: ["Power up, Babe", "Nope"], size: "250ml" },
      }),
    ApiError,
  );
});

Deno.test("a hand-written submission cannot smuggle a key past the question set", () => {
  // The frontend is not trusted: editing the form in the browser reaches here.
  assert.throws(
    () => validateSubmission(parsed(), { answers: { sneaky: "x", size: "250ml" } }),
    ApiError,
  );
  // A single_choice answered as a list, and a multi_choice answered as a string.
  assert.throws(
    () => validateSubmission(parsed(), { answers: { size: ["100ml", "250ml"] } }),
    ApiError,
  );
  assert.throws(
    () => validateSubmission(parsed(), { answers: { size: "250ml", drinks: "Power up, Babe" } }),
    ApiError,
  );
  // Answers must be an object at all.
  assert.throws(() => validateSubmission(parsed(), { answers: ["250ml"] }), ApiError);
});

Deno.test("optional questions may be skipped and are simply absent", () => {
  const { answers } = validateSubmission(parsed(), { answers: { size: "250ml" } });
  assert.deepEqual(answers, { size: "250ml" });
});

Deno.test("a required question must be answered", () => {
  assert.throws(() => validateSubmission(parsed(), { answers: {} }), ApiError);
  assert.throws(() => validateSubmission(parsed(), { answers: { size: "   " } }), ApiError);
});

Deno.test("text longer than the question allows is refused", () => {
  assert.throws(
    () =>
      validateSubmission(parsed(), {
        answers: { size: "250ml", flavour: "x".repeat(121) },
      }),
    ApiError,
  );
});

Deno.test("a question set that cannot be trusted is a server fault, not a bad request", () => {
  const cases: unknown[][] = [
    [{ key: "a", type: "mystery", prompt: "?" }],
    // A choice question with no options to validate an answer against.
    [{ key: "a", type: "single_choice", prompt: "?" }],
    [{ key: "a", type: "multi_choice", prompt: "?", options: ["x", "x"] }],
    [{ key: "a", type: "text", prompt: "?" }, { key: "a", type: "text", prompt: "?" }],
    [{ key: "a", type: "text", prompt: "" }],
  ];

  for (const questions of cases) {
    assert.throws(
      () => parseQuestions(questions, "broken"),
      (error: unknown) => error instanceof ApiError && error.status === 500,
    );
  }
});

Deno.test("a participant id is required and a verified one wins", () => {
  const claimed = "33333333-3333-4333-8333-333333333333";
  const verified = "44444444-4444-4444-8444-444444444444";

  assert.equal(participantId(claimed, null), claimed);
  assert.equal(participantId(claimed, verified), verified);
  assert.throws(() => participantId("not-a-uuid", null), ApiError);
  assert.throws(() => participantId(undefined, null), ApiError);
});

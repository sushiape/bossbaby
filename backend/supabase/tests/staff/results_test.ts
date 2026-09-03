import assert from "node:assert/strict";
import { describeResponses, summariseSurvey } from "../../functions/staff/results.ts";
import type { ResponseRow, SurveyRowForResults } from "../../functions/staff/types.ts";

const QUESTIONS: unknown[] = [
  {
    key: "size",
    type: "single_choice",
    prompt: "I would like to buy...",
    options: ["100ml", "150ml", "330ml"],
    required: true,
  },
  {
    key: "drinks",
    type: "multi_choice",
    prompt: "Which drink?",
    options: ["Power Up", "Glow Up", "Just Chill"],
    required: true,
  },
  { key: "flavour", type: "text", prompt: "Flavour I love...", maxLength: 120 },
];

function survey(questions: unknown = QUESTIONS): SurveyRowForResults {
  return {
    key: "product_fit_v1",
    title: "Product fit",
    purpose: null,
    questions,
    is_open: true,
    created_at: "2026-08-27T00:00:00Z",
    closes_at: null,
  };
}

function response(answers: unknown, index = 1): ResponseRow {
  return {
    id: `id-${index}`,
    answers,
    created_at: `2026-08-${String(index).padStart(2, "0")}T00:00:00Z`,
  };
}

function questionResult(results: ReturnType<typeof summariseSurvey>, key: string) {
  const found = results.questions.find((question) => question.key === key);
  assert.ok(found, `expected a result for ${key}`);
  return found;
}

Deno.test("counts every option, including ones nobody chose", () => {
  const results = summariseSurvey(survey(), [
    response({ size: "150ml", drinks: [], flavour: "" }, 1),
    response({ size: "150ml", drinks: [], flavour: "" }, 2),
  ]);

  // A zero is a finding: "nobody wanted the big one" must be distinguishable
  // from "we never offered it".
  assert.deepEqual(questionResult(results, "size").tallies, [
    { label: "100ml", count: 0 },
    { label: "150ml", count: 2 },
    { label: "330ml", count: 0 },
  ]);
});

Deno.test("ignores an answer that matches no current option", () => {
  // 250ml was corrected away by migration 202608290001. Attributing it to an
  // option no participant read would be a fiction.
  const results = summariseSurvey(survey(), [
    response({ size: "250ml" }, 1),
    response({ size: "150ml" }, 2),
  ]);

  const tallies = questionResult(results, "size").tallies ?? [];
  assert.equal(tallies.find((entry) => entry.label === "150ml")?.count, 1);
  assert.equal(tallies.some((entry) => entry.label === "250ml"), false);
});

Deno.test("ignores a key the survey does not ask", () => {
  // The walk goes over the question set, never the stored blob, so a response
  // cannot introduce a row into the dashboard.
  const results = summariseSurvey(survey(), [
    response({ size: "100ml", injected: "should not appear" }, 1),
  ]);

  assert.deepEqual(results.questions.map((question) => question.key), [
    "size",
    "drinks",
    "flavour",
  ]);
});

Deno.test("multi_choice counts each pick but a response only once per option", () => {
  const results = summariseSurvey(survey(), [
    response({ drinks: ["Power Up", "Glow Up"] }, 1),
    // A tampered blob repeating a value must not count twice.
    response({ drinks: ["Power Up", "Power Up"] }, 2),
  ]);

  const drinks = questionResult(results, "drinks");
  assert.deepEqual(drinks.tallies, [
    { label: "Power Up", count: 2 },
    { label: "Glow Up", count: 1 },
    { label: "Just Chill", count: 0 },
  ]);
  // Sums above the response count by design; the frontend says so.
  assert.equal(drinks.answered, 2);
});

Deno.test("groups text answers case-insensitively and keeps the common spelling", () => {
  const results = summariseSurvey(survey(), [
    response({ flavour: "Mango" }, 1),
    response({ flavour: "mango" }, 2),
    response({ flavour: " MANGO " }, 3),
    response({ flavour: "Mango" }, 4),
    response({ flavour: "Yuzu" }, 5),
  ]);

  const flavour = questionResult(results, "flavour");
  assert.deepEqual(flavour.answers, [
    { label: "Mango", count: 4 },
    { label: "Yuzu", count: 1 },
  ]);
  assert.equal(flavour.distinctAnswers, 2);
});

Deno.test("per-question n differs from the response count for an optional question", () => {
  const results = summariseSurvey(survey(), [
    response({ size: "100ml", flavour: "Yuzu" }, 1),
    response({ size: "100ml" }, 2),
    response({ size: "100ml", flavour: "   " }, 3),
  ]);

  assert.equal(results.responseCount, 3);
  assert.equal(questionResult(results, "size").answered, 3);
  // Blank and absent both mean unanswered.
  assert.equal(questionResult(results, "flavour").answered, 1);
});

Deno.test("survives a malformed answer blob", () => {
  const results = summariseSurvey(survey(), [
    response(null, 1),
    response("not an object", 2),
    response({ size: "150ml" }, 3),
  ]);

  assert.equal(results.responseCount, 3);
  assert.equal(
    (questionResult(results, "size").tallies ?? []).find((entry) => entry.label === "150ml")
      ?.count,
    1,
  );
});

Deno.test("renders responses in question order with multi_choice joined", () => {
  const { questions, responses } = describeResponses(survey(), [
    response({ size: "150ml", drinks: ["Power Up", "Glow Up"], flavour: "Mango" }, 1),
    response({ size: "100ml" }, 2),
  ]);

  assert.deepEqual(questions.map((question) => question.key), ["size", "drinks", "flavour"]);
  assert.deepEqual((responses[0] as { answers: Record<string, string> }).answers, {
    size: "150ml",
    drinks: "Power Up, Glow Up",
    flavour: "Mango",
  });
  // An unanswered question is an empty string, never undefined, so the table
  // renders a cell rather than a hole.
  assert.deepEqual((responses[1] as { answers: Record<string, string> }).answers, {
    size: "100ml",
    drinks: "",
    flavour: "",
  });
});

Deno.test("a malformed question set is a 500, not a wrong summary", () => {
  assert.throws(
    () => summariseSurvey(survey([{ key: "size", type: "rating", prompt: "?" }]), []),
    (error: unknown) => (error as { status?: number }).status === 500,
  );
});

Deno.test("folds one-off answers into an openable Other", () => {
  const results = summariseSurvey(survey(), [
    response({ flavour: "Mango" }, 1),
    response({ flavour: "mango" }, 2),
    response({ flavour: "Lychee" }, 3),
    response({ flavour: "Elderflower" }, 4),
  ]);

  const flavour = questionResult(results, "flavour");
  assert.deepEqual(flavour.answers, [{ label: "Mango", count: 2 }]);
  assert.equal(flavour.other?.count, 2);
  // The bucket opens: a singleton may be an unpopular answer or a
  // differently-spelled popular one, and only the words tell them apart.
  assert.deepEqual(flavour.other?.answers, ["Elderflower", "Lychee"]);
});

Deno.test("does not fold a single one-off answer", () => {
  // "Other: 1" hides a real answer behind a vaguer word and shortens nothing.
  const results = summariseSurvey(survey(), [
    response({ flavour: "Mango" }, 1),
    response({ flavour: "Mango" }, 2),
    response({ flavour: "Lychee" }, 3),
  ]);

  const flavour = questionResult(results, "flavour");
  assert.deepEqual(flavour.answers, [
    { label: "Mango", count: 2 },
    { label: "Lychee", count: 1 },
  ]);
  assert.equal(flavour.other, null);
});

Deno.test("filters every question to responses matching one answer", () => {
  const rows = [
    response({ size: "150ml", flavour: "Mango" }, 1),
    response({ size: "150ml", flavour: "Yuzu" }, 2),
    response({ size: "330ml", flavour: "Mango" }, 3),
  ];
  const results = summariseSurvey(survey(), rows, { questionKey: "size", value: "150ml" });

  assert.equal(results.responseCount, 2);
  // The unfiltered total stays visible, so a halved sample cannot pass for a
  // whole one.
  assert.equal(results.totalResponseCount, 3);
  // Both surviving flavours are one-offs within the filtered set, so they fold
  // -- the fold is computed after filtering, not before.
  const flavour = questionResult(results, "flavour");
  assert.deepEqual(flavour.answers, []);
  assert.deepEqual(flavour.other?.answers, ["Mango", "Yuzu"]);
});

Deno.test("offers only single_choice questions as filters", () => {
  const results = summariseSurvey(survey(), []);
  assert.deepEqual(results.filters, [
    { key: "size", prompt: "I would like to buy...", options: ["100ml", "150ml", "330ml"] },
  ]);
});

Deno.test("a filter naming an unknown question or value matches nothing", () => {
  const rows = [response({ size: "150ml" }, 1), response({ size: "100ml" }, 2)];

  // Returning everything would present unfiltered numbers as filtered ones.
  assert.equal(
    summariseSurvey(survey(), rows, { questionKey: "nope", value: "150ml" }).responseCount,
    0,
  );
  assert.equal(
    summariseSurvey(survey(), rows, { questionKey: "size", value: "250ml" }).responseCount,
    0,
  );
  // A text question has no fixed values to filter on.
  assert.equal(
    summariseSurvey(survey(), rows, { questionKey: "flavour", value: "Mango" }).responseCount,
    0,
  );
});

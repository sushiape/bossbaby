import assert from "node:assert/strict";
import { ApiError } from "../../functions/_shared/errors.ts";
import type { SaveResponseInput, SurveyRepository } from "../../functions/surveys/repository.ts";
import type { SurveyRow } from "../../functions/surveys/types.ts";
import { getOpenSurvey, getSurvey, submitResponse } from "../../functions/surveys/surveys.ts";

const QUESTIONS = [
  {
    key: "size",
    type: "single_choice",
    prompt: "Size?",
    required: true,
    options: ["100ml", "250ml"],
  },
  { key: "flavour", type: "text", prompt: "Flavour?" },
];

function survey(overrides: Partial<SurveyRow> = {}): SurveyRow {
  return {
    key: "launch_v2",
    family: "launch",
    supersedes: "launch_v1",
    title: "Four questions.",
    purpose: null,
    questions: QUESTIONS,
    is_open: true,
    created_at: "2026-08-26T00:00:00Z",
    closes_at: null,
    ...overrides,
  };
}

interface Recorder extends SurveyRepository {
  saved: SaveResponseInput[];
}

function repository(row: SurveyRow | null): Recorder {
  const recorder: Recorder = {
    saved: [],
    findByKey: (key) => Promise.resolve(row && row.key === key ? row : null),
    findOpenByFamily: (family) =>
      Promise.resolve(row && row.family === family && row.is_open ? row : null),
    saveResponse: (input) => {
      recorder.saved.push(input);
      return Promise.resolve();
    },
  };
  return recorder;
}

const PARTICIPANT = "33333333-3333-4333-8333-333333333333";

Deno.test("the rendered survey carries the wording and options only", async () => {
  const resource = await getOpenSurvey(repository(survey()), "launch");

  assert.equal(resource.key, "launch_v2");
  const size = resource.questions.find((question) => question.key === "size")!;
  assert.deepEqual(size.options, ["100ml", "250ml"]);
  assert.equal(size.required, true);
  // No survey question ever routes anywhere: email is the waitlist's, not ours.
  assert.equal(JSON.stringify(resource).includes("waitlist_subscriptions"), false);
});

Deno.test("a closed or expired survey is not served", async () => {
  await assert.rejects(() => getOpenSurvey(repository(survey({ is_open: false })), "launch"));
  await assert.rejects(
    () => getSurvey(repository(survey({ closes_at: "2020-01-01T00:00:00Z" })), "launch_v2"),
    ApiError,
  );
});

Deno.test("a submission is stored against the survey it was answered on", async () => {
  const repo = repository(survey());
  const result = await submitResponse(repo, "launch_v2", {
    participantId: PARTICIPANT,
    answers: { size: "250ml", flavour: "Mango" },
  }, null);

  assert.deepEqual(result, { status: "recorded", surveyKey: "launch_v2" });
  assert.deepEqual(repo.saved[0].answers, { size: "250ml", flavour: "Mango" });
  assert.equal(repo.saved[0].participantId, PARTICIPANT);
});

Deno.test("retrying a submission replaces rather than adds", async () => {
  // What makes "just submit again" safe after a half-failed flow: the same
  // participant id upserts onto the same row (ADR 0017).
  const repo = repository(survey());
  const body = { participantId: PARTICIPANT, answers: { size: "250ml" } };

  await submitResponse(repo, "launch_v2", body, null);
  await submitResponse(repo, "launch_v2", body, null);

  const keys = repo.saved.map((input) => `${input.surveyKey}:${input.participantId}`);
  assert.equal(new Set(keys).size, 1);
});

Deno.test("answering a survey that has since been superseded is refused", async () => {
  const repo = repository(survey());
  await assert.rejects(
    () =>
      submitResponse(repo, "launch_v1", {
        participantId: PARTICIPANT,
        answers: { size: "250ml" },
      }, null),
    ApiError,
  );
  assert.equal(repo.saved.length, 0);
});

Deno.test("a signed-in participant is used over the id in the body", async () => {
  const repo = repository(survey());
  const verified = "44444444-4444-4444-8444-444444444444";
  await submitResponse(repo, "launch_v2", {
    participantId: PARTICIPANT,
    answers: { size: "250ml" },
  }, verified);

  assert.equal(repo.saved[0].participantId, verified);
});

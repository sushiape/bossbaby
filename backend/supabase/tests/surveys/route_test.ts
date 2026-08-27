import assert from "node:assert/strict";
import { toApiError } from "../../functions/_shared/errors.ts";
import type { SurveyRepository } from "../../functions/surveys/repository.ts";
import type { SurveyRow } from "../../functions/surveys/types.ts";
import { handleSurveyRequest } from "../../functions/surveys/route.ts";

const ROW: SurveyRow = {
  key: "launch_v2",
  family: "launch",
  supersedes: null,
  title: "Five questions.",
  purpose: null,
  questions: [{ key: "size", type: "single_choice", prompt: "Size?", options: ["100ml"] }],
  is_open: true,
  created_at: "2026-08-26T00:00:00Z",
  closes_at: null,
};

function repository(): SurveyRepository {
  return {
    findByKey: (key) => Promise.resolve(key === ROW.key ? ROW : null),
    findOpenByFamily: (family) => Promise.resolve(family === ROW.family ? ROW : null),
    saveResponse: () => Promise.resolve(),
  };
}

async function call(method: string, path: string, body?: unknown): Promise<Response> {
  const request = new Request(`https://edge.test/functions/v1${path}`, {
    method,
    ...(body === undefined ? {} : {
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    }),
  });
  try {
    return await handleSurveyRequest(request, repository, () => Promise.resolve(null));
  } catch (error) {
    const api = toApiError(error);
    return new Response(JSON.stringify({ error: { code: api.code } }), { status: api.status });
  }
}

Deno.test("the open survey for a family is served", async () => {
  const response = await call("GET", "/surveys/open?family=launch");
  assert.equal(response.status, 200);
  const { survey } = await response.json();
  assert.equal(survey.key, "launch_v2");
});

Deno.test("a family is required and must look like a key", async () => {
  assert.equal((await call("GET", "/surveys/open")).status, 400);
  assert.equal((await call("GET", "/surveys/open?family=Launch%20V2")).status, 400);
});

Deno.test("a survey can be fetched by key", async () => {
  assert.equal((await call("GET", "/surveys/launch_v2")).status, 200);
  assert.equal((await call("GET", "/surveys/launch_v9")).status, 404);
});

Deno.test("a response is posted to its own survey", async () => {
  const response = await call("POST", "/surveys/launch_v2/responses", {
    participantId: "55555555-5555-4555-8555-555555555555",
    answers: { size: "100ml" },
  });
  assert.equal(response.status, 201);
  const { response: recorded } = await response.json();
  assert.equal(recorded.status, "recorded");
});

Deno.test("preflight is answered without a body", async () => {
  const response = await call("OPTIONS", "/surveys/open?family=launch");
  assert.equal(response.status, 204);
});

Deno.test("unknown routes and methods are refused", async () => {
  assert.equal((await call("GET", "/surveys/launch_v2/responses")).status, 404);
  assert.equal((await call("PATCH", "/surveys/launch_v2")).status, 405);
});

Deno.test("a body that is not JSON is a validation failure", async () => {
  const request = new Request("https://edge.test/functions/v1/surveys/launch_v2/responses", {
    method: "POST",
    body: "not json",
  });
  const error = await handleSurveyRequest(request, repository, () => Promise.resolve(null))
    .then(() => null, (thrown) => toApiError(thrown));
  assert.equal(error?.status, 400);
});

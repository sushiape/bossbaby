import assert from "node:assert/strict";
import { handleWaitlistRequest } from "../../functions/waitlist/route.ts";
import type { WaitlistSubscriptionRepository } from "../../functions/waitlist/types.ts";

Deno.test("waitlist route accepts normalized subscriptions without exposing existence", async () => {
  const saved: Array<{ email: string; source: string }> = [];
  const repository: WaitlistSubscriptionRepository = {
    ensureSubscription(email, source) {
      saved.push({ email, source });
      return Promise.resolve();
    },
  };

  const response = await handleWaitlistRequest(
    new Request("http://localhost/functions/v1/waitlist/subscriptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: " Ada@Example.com " }),
    }),
    () => repository,
  );

  assert.equal(response.status, 202);
  assert.deepEqual(saved, [{ email: "ada@example.com", source: "website" }]);
  assert.deepEqual(await response.json(), { subscription: { status: "accepted" } });
});

Deno.test("waitlist preflight does not create a repository", async () => {
  let repositoryCreated = false;
  const response = await handleWaitlistRequest(
    new Request("http://localhost/functions/v1/waitlist/subscriptions", { method: "OPTIONS" }),
    () => {
      repositoryCreated = true;
      throw new Error("repository should not be created");
    },
  );

  assert.equal(response.status, 204);
  assert.equal(repositoryCreated, false);
});

Deno.test("waitlist route attributes a survey signup to the survey", async () => {
  const saved: Array<{ email: string; source: string }> = [];
  const repository: WaitlistSubscriptionRepository = {
    ensureSubscription(email, source) {
      saved.push({ email, source });
      return Promise.resolve();
    },
  };

  const response = await handleWaitlistRequest(
    new Request("http://localhost/functions/v1/waitlist/subscriptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "ada@example.com", source: "survey" }),
    }),
    () => repository,
  );

  assert.equal(response.status, 202);
  assert.deepEqual(saved, [{ email: "ada@example.com", source: "survey" }]);
});

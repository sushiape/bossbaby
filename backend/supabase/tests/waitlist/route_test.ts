import assert from "node:assert/strict";
import { handleWaitlistRequest } from "../../functions/waitlist/route.ts";
import type { WaitlistSubscriptionRepository } from "../../functions/waitlist/types.ts";

Deno.test("waitlist route accepts normalized subscriptions without exposing existence", async () => {
  const saved: string[] = [];
  const repository: WaitlistSubscriptionRepository = {
    ensureSubscription(email) {
      saved.push(email);
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
  assert.deepEqual(saved, ["ada@example.com"]);
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

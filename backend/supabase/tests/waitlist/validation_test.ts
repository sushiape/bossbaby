import assert from "node:assert/strict";
import { ApiError } from "../../functions/_shared/errors.ts";
import { validateSubscription } from "../../functions/waitlist/validation.ts";

function assertValidationError(fn: () => unknown): void {
  assert.throws(
    fn,
    (error: unknown) => error instanceof ApiError && error.code === "VALIDATION_FAILED",
  );
}

Deno.test("waitlist validation normalizes email addresses", () => {
  assert.deepEqual(validateSubscription({ email: "  Ada@Example.COM  " }), {
    email: "ada@example.com",
    source: "website",
  });
});

Deno.test("waitlist validation rejects malformed emails", () => {
  assertValidationError(() => validateSubscription({ email: "not-an-email" }));
  assertValidationError(() => validateSubscription({ email: "@example.com" }));
});

Deno.test("waitlist validation rejects undisclosed fields", () => {
  assertValidationError(() => validateSubscription({ email: "ada@example.com", mood: "calm" }));
});

Deno.test("waitlist validation defaults an unattributed signup to the website", () => {
  assert.deepEqual(validateSubscription({ email: "ada@example.com" }), {
    email: "ada@example.com",
    source: "website",
  });
});

Deno.test("waitlist validation accepts an allowed source", () => {
  assert.deepEqual(validateSubscription({ email: "ada@example.com", source: "survey" }), {
    email: "ada@example.com",
    source: "survey",
  });
});

// The column only checks the shape of a source key, so an arbitrary client
// string would be stored verbatim. The allowlist is what keeps the channel
// vocabulary the team reports on from being written by a browser.
Deno.test("waitlist validation rejects a source outside the allowlist", () => {
  assertValidationError(() => validateSubscription({ email: "ada@example.com", source: "spam" }));
  assertValidationError(() => validateSubscription({ email: "ada@example.com", source: "staff" }));
  assertValidationError(() => validateSubscription({ email: "ada@example.com", source: 7 }));
});

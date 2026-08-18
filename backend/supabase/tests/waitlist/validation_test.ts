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
  });
});

Deno.test("waitlist validation rejects malformed emails", () => {
  assertValidationError(() => validateSubscription({ email: "not-an-email" }));
  assertValidationError(() => validateSubscription({ email: "@example.com" }));
});

Deno.test("waitlist validation rejects undisclosed fields", () => {
  assertValidationError(() => validateSubscription({ email: "ada@example.com", mood: "calm" }));
});

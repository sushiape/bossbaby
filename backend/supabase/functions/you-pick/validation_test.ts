import assert from "node:assert/strict";
import { ApiError } from "../_shared/errors.ts";
import { validateSuggestion, validateVote } from "./validation.ts";

function assertApiError(fn: () => unknown, status: number, code: string): void {
  assert.throws(fn, (error: unknown) => {
    assert(error instanceof ApiError);
    assert.equal(error.status, status);
    assert.equal(error.code, code);
    return true;
  });
}

Deno.test("validateSuggestion trims accepted fields", () => {
  assert.deepEqual(validateSuggestion({ authorName: "  Ada  ", text: "  Mango  " }), {
    authorName: "Ada",
    text: "Mango",
  });
});

Deno.test("validateSuggestion rejects participant identifiers", () => {
  assertApiError(
    () => validateSuggestion({ authorName: "Ada", text: "Mango", user_id: "spoofed" }),
    400,
    "VALIDATION_FAILED",
  );
});

Deno.test("validateVote removes duplicate selections", () => {
  assert.deepEqual(
    validateVote({
      pack: ["100 ml Bottle · A concentrated daily shot"],
      flavour: ["Mango Peach", "Mango Peach"],
    }),
    {
      pack: ["100 ml Bottle · A concentrated daily shot"],
      flavour: ["Mango Peach"],
    },
  );
});

Deno.test("validateVote rejects unknown options", () => {
  assertApiError(
    () => validateVote({ pack: [], flavour: ["Unreviewed flavour"] }),
    400,
    "VALIDATION_FAILED",
  );
});

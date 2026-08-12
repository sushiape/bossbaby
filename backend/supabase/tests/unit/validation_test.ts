import { ApiError } from "../../functions/_shared/errors.ts";
import {
  decodeCursor,
  encodeCursor,
  normalizeSuggestion,
} from "../../functions/you-pick/suggestions.ts";
import { validateSuggestion, validateVote } from "../../functions/you-pick/validation.ts";

function assert(condition: unknown, message = "Assertion failed"): asserts condition {
  if (!condition) throw new Error(message);
}

function assertApiError(action: () => unknown, code: string): void {
  try {
    action();
    throw new Error("Expected ApiError");
  } catch (error) {
    assert(error instanceof ApiError, "Expected ApiError instance");
    assert(error.code === code, `Expected ${code}, got ${error.code}`);
  }
}

Deno.test("vote validation accepts known non-empty selections", () => {
  const value = validateVote({ pack: [], flavour: ["Mixed Berries"] });
  assert(value.flavour[0] === "Mixed Berries");
});

Deno.test("vote validation rejects empty and unknown selections", () => {
  assertApiError(() => validateVote({ pack: [], flavour: [] }), "VALIDATION_FAILED");
  assertApiError(() => validateVote({ pack: ["Tampered"], flavour: [] }), "VALIDATION_FAILED");
});

Deno.test("suggestion validation trims and enforces limits", () => {
  const value = validateSuggestion({ authorName: "  Ada  ", text: "  Mango fizz  " });
  assert(value.authorName === "Ada");
  assert(value.text === "Mango fizz");
  assertApiError(
    () => validateSuggestion({ authorName: "x".repeat(61), text: "ok" }),
    "VALIDATION_FAILED",
  );
  assertApiError(
    () => validateSuggestion({ authorName: "Ada", text: "x".repeat(501) }),
    "VALIDATION_FAILED",
  );
  assertApiError(
    () => validateSuggestion({ authorName: "Ada", text: "ok", user_id: "spoof" }),
    "VALIDATION_FAILED",
  );
});

Deno.test("cursor round trips and rejects tampering", () => {
  const cursor = {
    createdAt: "2026-08-12T10:00:00.000Z",
    id: "10000000-0000-4000-8000-000000000001",
  };
  const decoded = decodeCursor(encodeCursor(cursor));
  assert(decoded.createdAt === cursor.createdAt);
  assert(decoded.id === cursor.id);
  assertApiError(() => decodeCursor("not-a-cursor"), "VALIDATION_FAILED");
});

Deno.test("suggestion normalization omits participant data", () => {
  const row = {
    id: "10000000-0000-4000-8000-000000000001",
    user_id: "00000000-0000-4000-8000-000000000001",
    author_name: "Ada",
    text: "Mango fizz",
    created_at: "2026-08-12T10:00:00.000Z",
  };
  const publicValue = normalizeSuggestion(row);
  assert(!("user_id" in publicValue));
  assert(!("canDelete" in publicValue));
  const participantValue = normalizeSuggestion(row, row.user_id);
  assert(participantValue.canDelete === true);
  assert(!("user_id" in participantValue));
});

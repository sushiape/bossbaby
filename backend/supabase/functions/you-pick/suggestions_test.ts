import assert from "node:assert/strict";
import { ApiError } from "../_shared/errors.ts";
import { decodeCursor, encodeCursor, normalizeSuggestion } from "./suggestions.ts";

Deno.test("suggestion cursors round-trip", () => {
  const cursor = {
    createdAt: "2026-08-17T12:00:00.000Z",
    id: "123e4567-e89b-42d3-a456-426614174000",
  };

  assert.deepEqual(decodeCursor(encodeCursor(cursor)), cursor);
});

Deno.test("invalid suggestion cursors produce a validation error", () => {
  assert.throws(
    () => decodeCursor("not-a-cursor"),
    (error: unknown) => error instanceof ApiError && error.status === 400,
  );
});

Deno.test("suggestions expose ownership only to identified participants", () => {
  const row = {
    id: "123e4567-e89b-42d3-a456-426614174000",
    user_id: "participant-1",
    author_name: "Ada",
    text: "Mango",
    created_at: "2026-08-17T12:00:00.000Z",
  };

  assert.equal(normalizeSuggestion(row).canDelete, undefined);
  assert.equal(normalizeSuggestion(row, "participant-1").canDelete, true);
  assert.equal(normalizeSuggestion(row, "participant-2").canDelete, false);
});

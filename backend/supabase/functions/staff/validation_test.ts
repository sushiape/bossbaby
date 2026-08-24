import assert from "node:assert/strict";
import { ApiError } from "../_shared/errors.ts";
import { assertConsent, parseImport, parseSubscriptionQuery } from "./validation.ts";

Deno.test("a partially valid paste keeps the good addresses and reports the rest", () => {
  const { emails, rejected } = parseImport("one@example.com\nnot-an-email\ntwo@example.com");

  assert.deepEqual(emails, ["one@example.com", "two@example.com"]);
  assert.deepEqual(rejected, [{ line: 2, value: "not-an-email", reason: "malformed" }]);
});

Deno.test("addresses are normalized and blank lines ignored", () => {
  const { emails, rejected } = parseImport("  Someone@Example.COM  \n\n\n");

  assert.deepEqual(emails, ["someone@example.com"]);
  assert.deepEqual(rejected, []);
});

Deno.test("a duplicate inside one paste is reported, not imported twice", () => {
  const { emails, rejected } = parseImport("dup@example.com\nDUP@example.com");

  assert.deepEqual(emails, ["dup@example.com"]);
  assert.equal(rejected.length, 1);
  assert.equal(rejected[0].reason, "duplicate in paste");
});

Deno.test("import without an explicit consent affirmation is refused", () => {
  assert.throws(() => assertConsent({}), ApiError);
  assert.throws(() => assertConsent({ consent_affirmed: "yes" }), ApiError);
  assertConsent({ consent_affirmed: true });
});

Deno.test("search is normalized and limit is bounded", () => {
  const query = parseSubscriptionQuery(
    new URL("https://x/staff/waitlist?search=%20ADA%20&limit=10"),
  );
  assert.equal(query.search, "ada");
  assert.equal(query.limit, 10);

  assert.throws(
    () => parseSubscriptionQuery(new URL("https://x/staff/waitlist?limit=9999")),
    ApiError,
  );
});

import assert from "node:assert/strict";
import test from "node:test";
import { isRecoveryUrl } from "./recovery.ts";

test("a recovery link fragment is recognised", () => {
  assert.equal(
    isRecoveryUrl("#access_token=abc&refresh_token=def&type=recovery"),
    true,
  );
});

test("an ordinary visit is not treated as recovery", () => {
  assert.equal(isRecoveryUrl(""), false);
  assert.equal(isRecoveryUrl("#"), false);
  assert.equal(isRecoveryUrl("#access_token=abc&type=signup"), false);
});

import assert from "node:assert/strict";
import test from "node:test";
import { isPasswordSetupUrl } from "./passwordSetup.ts";

test("a reset link fragment is recognised", () => {
  assert.equal(
    isPasswordSetupUrl("#access_token=abc&refresh_token=def&type=recovery"),
    true,
  );
});

test("an invite link fragment is recognised", () => {
  // Invited Staff Members reach the same screen as a reset. Before this, an
  // invite fell through to the ordinary sign-in path and the invited person was
  // signed straight in without ever choosing a password — locked out on their
  // next visit, because the first one appeared to work.
  assert.equal(
    isPasswordSetupUrl("#access_token=abc&refresh_token=def&type=invite"),
    true,
  );
  // The literal type on a Supabase invite is unconfirmed; signup is matched so
  // a wrong guess still reaches Password Setup rather than the homepage.
  assert.equal(isPasswordSetupUrl("#access_token=abc&type=signup"), true);
});

test("an ordinary visit is not treated as password setup", () => {
  assert.equal(isPasswordSetupUrl(""), false);
  assert.equal(isPasswordSetupUrl("#"), false);
  assert.equal(isPasswordSetupUrl("#access_token=abc&type=magiclink"), false);
});

test("an expired link is not treated as password setup", () => {
  // Supabase returns expiry as an error fragment with no type. There is no
  // credential to spend, so it must not open the set-a-password screen.
  assert.equal(
    isPasswordSetupUrl("#error=access_denied&error_code=otp_expired"),
    false,
  );
});

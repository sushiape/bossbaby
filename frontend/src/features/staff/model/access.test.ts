import assert from "node:assert/strict";
import test from "node:test";
import { availableTabs, hasCapability, landingTab } from "./access.ts";
import type { StaffAccess } from "./types.ts";

function access(...names: string[]): StaffAccess {
  return {
    userId: "user-1",
    email: "staff@example.com",
    capabilities: names.map((name) => ({ name, description: `${name} description` })),
  };
}

test("My Access is always available to any staff member", () => {
  assert.deepEqual(availableTabs(access("restricted_app.access")), ["access"]);
});

test("the Waitlist tab appears only with waitlist.read", () => {
  assert.deepEqual(availableTabs(access("waitlist.read")), ["waitlist", "access"]);
  assert.deepEqual(availableTabs(access("waitlist.manage")), ["access"]);
});

test("an identity holding only restricted app access lands on My Access", () => {
  assert.equal(landingTab(access("restricted_app.access")), "access");
});

test("an identity holding waitlist.read lands on the Waitlist tab", () => {
  assert.equal(landingTab(access("waitlist.read", "restricted_app.access")), "waitlist");
});

test("hasCapability reports exactly the held grants", () => {
  const staff = access("waitlist.read");
  assert.equal(hasCapability(staff, "waitlist.read"), true);
  assert.equal(hasCapability(staff, "waitlist.manage"), false);
  assert.equal(hasCapability(null, "waitlist.read"), false);
});

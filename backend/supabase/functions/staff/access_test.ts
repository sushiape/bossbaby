import assert from "node:assert/strict";
import type { User } from "npm:@supabase/supabase-js@2.112.3";
import type { StaffIdentity } from "../_shared/auth.ts";
import { describeAccess } from "./access.ts";
import type { CapabilityDescription, StaffRepository } from "./types.ts";

function identity(capabilities: string[]): StaffIdentity {
  return {
    user: { id: "user-1", email: "staff@example.com" } as User,
    capabilities,
  };
}

function repository(rows: CapabilityDescription[]): StaffRepository {
  return {
    describeCapabilities: (names) =>
      Promise.resolve(rows.filter((row) => names.includes(row.name))),
  };
}

Deno.test("My Access describes only the capabilities the identity holds", async () => {
  const repo = repository([
    { name: "waitlist.read", description: "View waitlist subscriptions." },
    { name: "waitlist.manage", description: "Add and remove subscriptions." },
  ]);

  const access = await describeAccess(repo, identity(["waitlist.read"]));

  assert.equal(access.userId, "user-1");
  assert.equal(access.email, "staff@example.com");
  assert.deepEqual(access.capabilities, [
    { name: "waitlist.read", description: "View waitlist subscriptions." },
  ]);
});

Deno.test("an identity holding only restricted app access sees just that", async () => {
  const repo = repository([
    { name: "restricted_app.access", description: "Use the unreleased application." },
    { name: "waitlist.read", description: "View waitlist subscriptions." },
  ]);

  const access = await describeAccess(repo, identity(["restricted_app.access"]));

  assert.deepEqual(access.capabilities.map((row) => row.name), ["restricted_app.access"]);
});

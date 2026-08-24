import type { StaffIdentity } from "../_shared/auth.ts";
import type { StaffAccess, StaffRepository } from "./types.ts";

/**
 * Builds the My Access view: who is signed in and what they may do, in plain
 * language. Read-only by construction — there is no grant or revoke path.
 */
export async function describeAccess(
  repository: StaffRepository,
  identity: StaffIdentity,
): Promise<StaffAccess> {
  const capabilities = await repository.describeCapabilities(identity.capabilities);
  return {
    userId: identity.user.id,
    email: identity.user.email ?? null,
    capabilities,
  };
}

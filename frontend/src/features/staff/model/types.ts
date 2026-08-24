export interface CapabilityDescription {
  name: string;
  description: string;
}

/** Mirrors the `staff` Edge Function's GET /me payload. */
export interface StaffAccess {
  userId: string;
  email: string | null;
  capabilities: CapabilityDescription[];
}

export type WorkspaceTab = "waitlist" | "access";

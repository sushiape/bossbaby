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

export interface WaitlistSubscription {
  id: string;
  email: string;
  source: string;
  createdAt: string;
}

export interface SubscriptionPage {
  subscriptions: WaitlistSubscription[];
  total: number;
  nextCursor: string | null;
}

export interface RejectedImportLine {
  line: number;
  value: string;
  reason: string;
}

export interface ImportSummary {
  added: number;
  skippedDuplicate: number;
  rejected: RejectedImportLine[];
}

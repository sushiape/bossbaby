export interface CapabilityDescription {
  name: string;
  description: string;
}

export interface StaffAccess {
  userId: string;
  email: string | null;
  capabilities: CapabilityDescription[];
}

export interface StaffRepository {
  describeCapabilities(names: string[]): Promise<CapabilityDescription[]>;
}

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

export interface SubscriptionQuery {
  search: string | null;
  limit: number;
  cursor: string | null;
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

export interface SubscriptionRepository {
  listSubscriptions(query: SubscriptionQuery): Promise<SubscriptionPage>;
  /** Returns the emails that were newly inserted; duplicates are skipped. */
  importSubscriptions(emails: string[], staffUserId: string): Promise<string[]>;
  removeSubscription(id: string): Promise<boolean>;
}

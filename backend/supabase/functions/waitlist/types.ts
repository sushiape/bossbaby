export interface WaitlistSubscriptionRepository {
  ensureSubscription(email: string, source: string): Promise<void>;
}

export interface AcceptedSubscription {
  status: "accepted";
}

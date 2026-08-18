export interface WaitlistSubscriptionRepository {
  ensureSubscription(email: string): Promise<void>;
}

export interface AcceptedSubscription {
  status: "accepted";
}

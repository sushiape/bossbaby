import type { AcceptedSubscription, WaitlistSubscriptionRepository } from "./types.ts";
import { validateSubscription } from "./validation.ts";

export async function subscribe(
  repository: WaitlistSubscriptionRepository,
  input: unknown,
): Promise<AcceptedSubscription> {
  const { email, source } = validateSubscription(input);
  await repository.ensureSubscription(email, source);
  return { status: "accepted" };
}

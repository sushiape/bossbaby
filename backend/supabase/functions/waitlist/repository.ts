import type { SupabaseClient } from "npm:@supabase/supabase-js@2.112.3";
import type { WaitlistSubscriptionRepository } from "./types.ts";

export function createWaitlistSubscriptionRepository(
  client: SupabaseClient,
): WaitlistSubscriptionRepository {
  return {
    // ignoreDuplicates is what makes a repeat signup a true no-op, so an
    // address keeps the Subscription Source it first arrived with rather than
    // being re-attributed by whichever page it was re-entered on.
    async ensureSubscription(email: string, source: string): Promise<void> {
      const { error } = await client.from("waitlist_subscriptions").upsert(
        { email, source },
        { onConflict: "email", ignoreDuplicates: true },
      );
      if (error) throw error;
    },
  };
}

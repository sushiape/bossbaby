import type { SupabaseClient } from "npm:@supabase/supabase-js@2.112.3";
import type { WaitlistSubscriptionRepository } from "./types.ts";

export function createWaitlistSubscriptionRepository(
  client: SupabaseClient,
): WaitlistSubscriptionRepository {
  return {
    async ensureSubscription(email: string): Promise<void> {
      const { error } = await client.from("waitlist_subscriptions").upsert(
        { email },
        { onConflict: "email", ignoreDuplicates: true },
      );
      if (error) throw error;
    },
  };
}

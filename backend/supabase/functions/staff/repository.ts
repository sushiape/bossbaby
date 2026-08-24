import type { SupabaseClient } from "npm:@supabase/supabase-js@2.112.3";
import type {
  CapabilityDescription,
  StaffRepository,
  SubscriptionPage,
  SubscriptionQuery,
  SubscriptionRepository,
} from "./types.ts";

export function createStaffRepository(client: SupabaseClient): StaffRepository {
  return {
    async describeCapabilities(names: string[]): Promise<CapabilityDescription[]> {
      if (names.length === 0) return [];
      const { data, error } = await client
        .from("staff_capabilities")
        .select("name, description")
        .in("name", names)
        .order("name");
      if (error) throw error;
      return (data ?? []) as CapabilityDescription[];
    },
  };
}

export function createSubscriptionRepository(client: SupabaseClient): SubscriptionRepository {
  return {
    async listSubscriptions(query: SubscriptionQuery): Promise<SubscriptionPage> {
      let request = client
        .from("waitlist_subscriptions")
        .select("id, email, source, created_at", { count: "exact" })
        .order("created_at", { ascending: false })
        .order("id", { ascending: false })
        .limit(query.limit + 1);

      if (query.search) {
        // The search text is passed as a value, never interpolated into SQL.
        request = request.ilike("email", `%${query.search}%`);
      }
      if (query.cursor) {
        request = request.lt("created_at", query.cursor);
      }

      const { data, error, count } = await request;
      if (error) throw error;

      const rows = data ?? [];
      const hasMore = rows.length > query.limit;
      const page = hasMore ? rows.slice(0, query.limit) : rows;

      return {
        subscriptions: page.map((row) => ({
          id: row.id as string,
          email: row.email as string,
          source: row.source as string,
          createdAt: row.created_at as string,
        })),
        total: count ?? page.length,
        nextCursor: hasMore ? (page[page.length - 1].created_at as string) : null,
      };
    },

    /**
     * First-touch attribution: ignoreDuplicates means an address already on the
     * list keeps its original source and created_at. Enforced here rather than
     * left to callers, matching the public endpoint.
     */
    async importSubscriptions(emails: string[], staffUserId: string): Promise<string[]> {
      if (emails.length === 0) return [];
      const { data, error } = await client
        .from("waitlist_subscriptions")
        .upsert(
          emails.map((email) => ({ email, source: "staff", created_by: staffUserId })),
          { onConflict: "email", ignoreDuplicates: true },
        )
        .select("email");
      if (error) throw error;
      return (data ?? []).map((row) => row.email as string);
    },

    async removeSubscription(id: string): Promise<boolean> {
      const { data, error } = await client
        .from("waitlist_subscriptions")
        .delete()
        .eq("id", id)
        .select("id");
      if (error) throw error;
      return (data ?? []).length > 0;
    },
  };
}

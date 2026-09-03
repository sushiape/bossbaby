import type { SupabaseClient } from "npm:@supabase/supabase-js@2.112.3";
import type {
  CapabilityDescription,
  StaffRepository,
  SubscriptionPage,
  SubscriptionQuery,
  SubscriptionRepository,
  SurveyResultsRepository,
  SurveyRowForResults,
  SurveySummary,
  ResponseQuery,
  ResponseRow,
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

/**
 * Reads surveys and their responses for the Staff Workspace.
 *
 * Both tables deny anon and authenticated (see the surveys migration), so this
 * runs on the function's service-role client like every other staff read — the
 * boundary ADR 0008 and ADR 0010 draw. Nothing here writes: opening and closing
 * a survey remains a SQL job.
 */
export function createSurveyResultsRepository(client: SupabaseClient): SurveyResultsRepository {
  return {
    async listSurveys(): Promise<SurveySummary[]> {
      const { data, error } = await client
        .from("surveys")
        .select("key, title, is_open, created_at, closes_at")
        .order("created_at", { ascending: false });
      if (error) throw error;

      const surveys = data ?? [];
      // One count per survey rather than a join: head+exact returns the number
      // without transferring a single response row, and the survey list is
      // short by nature (a handful of rows, one per survey ever run).
      return await Promise.all(surveys.map(async (row) => {
        const { count, error: countError } = await client
          .from("survey_responses")
          .select("id", { count: "exact", head: true })
          .eq("survey_key", row.key as string);
        if (countError) throw countError;
        return {
          key: row.key as string,
          title: row.title as string,
          isOpen: row.is_open as boolean,
          createdAt: row.created_at as string,
          closesAt: (row.closes_at as string | null) ?? null,
          responseCount: count ?? 0,
        };
      }));
    },

    async findSurvey(key: string): Promise<SurveyRowForResults | null> {
      const { data, error } = await client
        .from("surveys")
        .select("key, title, purpose, questions, is_open, created_at, closes_at")
        .eq("key", key)
        .maybeSingle();
      if (error) throw error;
      return (data as SurveyRowForResults | null) ?? null;
    },

    /**
     * Every response for one survey, for counting.
     *
     * Deliberately unpaginated: a tally over a page would be a wrong number
     * presented as a right one, which is worse than a slow request. The blobs
     * are capped at 16 KB each by the surveys migration and are realistically a
     * few hundred bytes, so this stays cheap at the volumes a landing-page
     * popup produces. Revisit if a survey ever collects tens of thousands.
     */
    async allResponses(surveyKey: string): Promise<ResponseRow[]> {
      const { data, error } = await client
        .from("survey_responses")
        .select("id, answers, created_at")
        .eq("survey_key", surveyKey);
      if (error) throw error;
      return (data ?? []) as ResponseRow[];
    },

    async pageResponses(surveyKey: string, query: ResponseQuery) {
      let request = client
        .from("survey_responses")
        .select("id, answers, created_at", { count: "exact" })
        .eq("survey_key", surveyKey)
        .order("created_at", { ascending: false })
        .order("id", { ascending: false })
        .limit(query.limit + 1);

      if (query.cursor) request = request.lt("created_at", query.cursor);
      // Filtering inside the jsonb blob rather than in code, so total and
      // nextCursor describe the filtered set: paging a list that was trimmed
      // after the query would report counts for rows the reader never sees.
      // The key and value are passed as values, never interpolated.
      if (query.filter) {
        request = request.eq(`answers->>${query.filter.questionKey}`, query.filter.value);
      }

      const { data, error, count } = await request;
      if (error) throw error;

      const rows = (data ?? []) as ResponseRow[];
      const hasMore = rows.length > query.limit;
      const page = hasMore ? rows.slice(0, query.limit) : rows;

      return {
        rows: page,
        total: count ?? page.length,
        nextCursor: hasMore ? page[page.length - 1].created_at : null,
      };
    },
  };
}

import type { SupabaseClient } from "npm:@supabase/supabase-js@2.112.3";
import { ApiError } from "../_shared/errors.ts";
import type { AnswerValue, SurveyRow } from "./types.ts";

/**
 * Data access for surveys.
 *
 * Both tables are service_role only (ADR 0008, ADR 0010), so this function is
 * the only way in and every read below is already authorized by being here.
 */
export interface SurveyRepository {
  findByKey(key: string): Promise<SurveyRow | null>;
  findOpenByFamily(family: string): Promise<SurveyRow | null>;
  saveResponse(input: SaveResponseInput): Promise<void>;
}

export interface SaveResponseInput {
  surveyKey: string;
  participantId: string;
  answers: Record<string, AnswerValue>;
}

const SURVEY_COLUMNS =
  "key, family, supersedes, title, purpose, questions, is_open, created_at, closes_at";

export function createSurveyRepository(client: SupabaseClient): SurveyRepository {
  return {
    async findByKey(key: string): Promise<SurveyRow | null> {
      const { data, error } = await client
        .from("surveys")
        .select(SURVEY_COLUMNS)
        .eq("key", key)
        .maybeSingle();
      if (error) throw error;
      return (data as SurveyRow | null) ?? null;
    },

    /**
     * The current version of a survey. `family` is shared by every version and
     * only one is open at a time, so newest-open is the one to ask.
     */
    async findOpenByFamily(family: string): Promise<SurveyRow | null> {
      const { data, error } = await client
        .from("surveys")
        .select(SURVEY_COLUMNS)
        .eq("family", family)
        .eq("is_open", true)
        .order("created_at", { ascending: false })
        .limit(1);
      if (error) throw error;
      return (data?.[0] as SurveyRow | undefined) ?? null;
    },

    async saveResponse({ surveyKey, participantId, answers }: SaveResponseInput): Promise<void> {
      const { error } = await client.from("survey_responses").upsert(
        {
          survey_key: surveyKey,
          participant_id: participantId,
          answers,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "survey_key,participant_id" },
      );
      if (error) {
        console.error("Survey response persistence failed", {
          surveyKey,
          code: error.code,
          message: error.message,
        });
        throw new ApiError(500, "INTERNAL_ERROR", "Your answers could not be saved.");
      }
    },
  };
}

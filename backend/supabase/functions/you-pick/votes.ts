import type { SupabaseClient } from "npm:@supabase/supabase-js@2.112.3";
import { ApiError } from "../_shared/errors.ts";
import type { VoteResults } from "./types.ts";
import { validateVote } from "./validation.ts";

export async function getVoteResults(
  client: SupabaseClient,
  participantId?: string,
): Promise<VoteResults> {
  const { data, error } = await client.rpc("get_youpick_vote_results", {
    requested_poll_id: "default",
    participant_id: participantId ?? null,
  });
  if (error || !data) {
    throw new ApiError(500, "INTERNAL_ERROR", "Vote results could not be loaded.");
  }
  const result = data as VoteResults;
  if (!participantId) delete result.participantHasVoted;
  return result;
}

export async function replaceVote(
  client: SupabaseClient,
  participantId: string,
  value: unknown,
): Promise<void> {
  const selections = validateVote(value);
  const now = new Date().toISOString();
  const { error } = await client.from("youpick_votes").upsert(
    {
      poll_id: "default",
      user_id: participantId,
      selections,
      updated_at: now,
    },
    { onConflict: "poll_id,user_id" },
  );
  if (error) {
    console.error("Vote persistence failed", { code: error.code, message: error.message });
    throw new ApiError(500, "INTERNAL_ERROR", "Vote could not be saved.");
  }
}

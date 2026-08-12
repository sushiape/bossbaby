import { apiRequest } from "./apiClient";
import type { Suggestion, SuggestionPage, VoteResults, VoteSelections } from "../model/types";

export function getSuggestions(cursor?: string): Promise<SuggestionPage> {
  const query = new URLSearchParams({ limit: "8" });
  if (cursor) query.set("cursor", cursor);
  return apiRequest<SuggestionPage>(`/suggestions?${query}`);
}

export function createSuggestion(authorName: string, text: string): Promise<{ suggestion: Suggestion }> {
  return apiRequest(
    "/suggestions",
    { method: "POST", body: JSON.stringify({ authorName: authorName.trim(), text: text.trim() }) },
    "required",
  );
}

export function deleteSuggestion(id: string): Promise<void> {
  return apiRequest(`/suggestions/${encodeURIComponent(id)}`, { method: "DELETE" }, "required");
}

export function getVoteResults(): Promise<VoteResults> {
  return apiRequest<VoteResults>("/vote-results");
}

export function replaceVote(selections: VoteSelections): Promise<{ ok: true }> {
  return apiRequest("/vote", { method: "PUT", body: JSON.stringify(selections) }, "required");
}

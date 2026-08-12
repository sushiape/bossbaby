import { useCallback, useEffect, useState } from "react";
import * as api from "../api/youPickApi";
import type { VoteResults, VoteSelections } from "../model/types";
import { validateVote } from "../model/validation";

export function useVotes(enabled: boolean) {
  const [results, setResults] = useState<VoteResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setResults(await api.getVoteResults());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Vote results could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (enabled) void load();
  }, [enabled, load]);

  const submit = useCallback(async (selections: VoteSelections): Promise<boolean> => {
    setError(null);
    setFeedback(null);
    const validation = validateVote(selections);
    if (!validation.valid) {
      setError(validation.message ?? "Vote is invalid.");
      return false;
    }
    setSubmitting(true);
    try {
      await api.replaceVote(selections);
      setFeedback("Thank you. Your vote is counted. ✨");
      await load();
      return true;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Vote could not be saved.");
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [load]);

  return { results, loading, submitting, error, feedback, retry: load, submit };
}

import { useCallback, useEffect, useRef, useState } from "react";
import * as api from "../api/youPickApi";
import type { Suggestion } from "../model/types";
import { validateSuggestion } from "../model/validation";

function message(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export function useSuggestions(enabled: boolean) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [mutationId, setMutationId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const requestId = useRef(0);

  const loadFirstPage = useCallback(async () => {
    const id = ++requestId.current;
    setLoading(true);
    setError(null);
    try {
      const page = await api.getSuggestions();
      if (id !== requestId.current) return;
      setSuggestions(page.suggestions);
      setNextCursor(page.nextCursor);
      setHasMore(page.hasMore);
    } catch (cause) {
      if (id === requestId.current) setError(message(cause, "Suggestions could not be loaded."));
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (enabled) void loadFirstPage();
  }, [enabled, loadFirstPage]);

  const loadMore = useCallback(async () => {
    if (!nextCursor || loadingMore) return;
    setLoadingMore(true);
    setError(null);
    try {
      const page = await api.getSuggestions(nextCursor);
      setSuggestions((current) => {
        const seen = new Set(current.map((item) => item.id));
        return [...current, ...page.suggestions.filter((item) => !seen.has(item.id))];
      });
      setNextCursor(page.nextCursor);
      setHasMore(page.hasMore);
    } catch (cause) {
      setError(message(cause, "More suggestions could not be loaded."));
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, nextCursor]);

  const create = useCallback(async (authorName: string, text: string): Promise<boolean> => {
    setError(null);
    setFeedback(null);
    const validation = validateSuggestion(authorName, text);
    if (!validation.valid) {
      setError(validation.message ?? "Suggestion is invalid.");
      return false;
    }
    setMutationId("create");
    try {
      const { suggestion } = await api.createSuggestion(authorName, text);
      setSuggestions([suggestion]);
      setFeedback("Thanks — suggestion saved and shared.");
      await loadFirstPage();
      return true;
    } catch (cause) {
      setError(message(cause, "Suggestion could not be saved."));
      return false;
    } finally {
      setMutationId(null);
    }
  }, [loadFirstPage]);

  const remove = useCallback(async (id: string) => {
    setMutationId(id);
    setError(null);
    setFeedback(null);
    try {
      await api.deleteSuggestion(id);
      setSuggestions((current) => current.filter((item) => item.id !== id));
      setFeedback("Suggestion removed.");
    } catch (cause) {
      setError(message(cause, "Suggestion could not be removed."));
    } finally {
      setMutationId(null);
    }
  }, []);

  return {
    suggestions,
    hasMore,
    loading,
    loadingMore,
    mutationId,
    error,
    feedback,
    retry: loadFirstPage,
    loadMore,
    create,
    remove,
  };
}

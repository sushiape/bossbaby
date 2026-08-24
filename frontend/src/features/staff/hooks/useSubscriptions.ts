import { useCallback, useEffect, useRef, useState } from "react";
import { fetchSubscriptions } from "../api/staffApi";
import type { SubscriptionPage } from "../model/types";

/**
 * Owns the subscription list and its search.
 *
 * Selection lives here too, because it is coupled to the query: a selection
 * that survived a search could be sent to people the Staff Member can no longer
 * see. Changing the search clears it, visibly.
 */
export function useSubscriptions(enabled: boolean) {
  const [page, setPage] = useState<SubscriptionPage | null>(null);
  const [search, setSearchValue] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  const load = useCallback(async (term: string) => {
    const id = ++requestId.current;
    setLoading(true);
    setError(null);
    try {
      const result = await fetchSubscriptions({ search: term || undefined });
      // A slower earlier search must not overwrite a newer one.
      if (id === requestId.current) setPage(result);
    } catch (caught) {
      if (id === requestId.current) {
        setError(caught instanceof Error ? caught.message : "Could not load subscriptions.");
      }
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const timer = setTimeout(() => void load(search), search ? 250 : 0);
    return () => clearTimeout(timer);
  }, [enabled, search, load]);

  const setSearch = useCallback((term: string) => {
    setSearchValue(term);
    setSelected(new Set()); // Never carry a selection across a changed result set.
  }, []);

  const toggle = useCallback((id: string) => {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => setSelected(new Set()), []);
  const refresh = useCallback(() => load(search), [load, search]);

  return {
    page,
    search,
    setSearch,
    selected,
    toggle,
    clearSelection,
    loading,
    error,
    refresh,
  };
}

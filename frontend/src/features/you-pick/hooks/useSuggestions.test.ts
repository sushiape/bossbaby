import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const api = vi.hoisted(() => ({
  getSuggestions: vi.fn(),
  createSuggestion: vi.fn(),
  deleteSuggestion: vi.fn(),
}));
vi.mock("../api/youPickApi", () => api);

import { useSuggestions } from "./useSuggestions";

const first = { id: "1", authorName: "Ada", text: "One", createdAt: "2026-01-02T00:00:00Z", canDelete: true };
const second = { id: "2", authorName: "Bea", text: "Two", createdAt: "2026-01-01T00:00:00Z" };

describe("useSuggestions", () => {
  beforeEach(() => vi.clearAllMocks());

  it("loads, appends pages, and removes duplicates", async () => {
    api.getSuggestions
      .mockResolvedValueOnce({ suggestions: [first], nextCursor: "next", hasMore: true })
      .mockResolvedValueOnce({ suggestions: [first, second], nextCursor: null, hasMore: false });
    const { result } = renderHook(() => useSuggestions(true));
    await waitFor(() => expect(result.current.suggestions).toEqual([first]));
    await act(() => result.current.loadMore());
    expect(result.current.suggestions).toEqual([first, second]);
    expect(result.current.hasMore).toBe(false);
  });

  it("preserves feed and exposes inline mutation failure", async () => {
    api.getSuggestions.mockResolvedValue({ suggestions: [first], nextCursor: null, hasMore: false });
    api.deleteSuggestion.mockRejectedValue(new Error("Could not remove"));
    const { result } = renderHook(() => useSuggestions(true));
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(() => result.current.remove(first.id));
    expect(result.current.suggestions).toEqual([first]);
    expect(result.current.error).toBe("Could not remove");
  });
});

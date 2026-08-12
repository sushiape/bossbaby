import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SuggestionsPanel } from "./SuggestionsPanel";
import type { ReturnTypeOfUseSuggestions } from "../hooks/useSuggestions.types";

function controller(overrides: Partial<ReturnTypeOfUseSuggestions> = {}): ReturnTypeOfUseSuggestions {
  return {
    suggestions: Array.from({ length: 8 }, (_, index) => ({
      id: String(index),
      authorName: `Author ${index}`,
      text: `Idea ${index}`,
      createdAt: "2026-01-01T00:00:00Z",
    })),
    hasMore: true,
    loading: false,
    loadingMore: false,
    mutationId: null,
    error: null,
    feedback: null,
    retry: vi.fn(async () => undefined),
    loadMore: vi.fn(async () => undefined),
    create: vi.fn(async () => true),
    remove: vi.fn(async () => undefined),
    ...overrides,
  };
}

describe("SuggestionsPanel", () => {
  it("renders scroll area and shows Show more only when another page exists", () => {
    const value = controller();
    render(<SuggestionsPanel participantReady controller={value} />);
    expect(screen.getByTestId("suggestions-scroll-area")).toHaveClass("overflow-y-auto");
    fireEvent.click(screen.getByRole("button", { name: "Show more" }));
    expect(value.loadMore).toHaveBeenCalledOnce();
  });

  it("hides Show more when exhausted", () => {
    render(<SuggestionsPanel participantReady controller={controller({ hasMore: false })} />);
    expect(screen.queryByRole("button", { name: "Show more" })).not.toBeInTheDocument();
  });
});

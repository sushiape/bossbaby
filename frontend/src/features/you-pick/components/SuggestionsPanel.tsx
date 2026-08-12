import { useState, type FormEvent } from "react";
import type { ReturnTypeOfUseSuggestions } from "../hooks/useSuggestions.types";

function timestamp(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

interface SuggestionsPanelProps {
  participantReady: boolean;
  controller: ReturnTypeOfUseSuggestions;
}

export function SuggestionsPanel({ participantReady, controller }: SuggestionsPanelProps) {
  const [authorName, setAuthorName] = useState("");
  const [text, setText] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (await controller.create(authorName, text)) {
      setAuthorName("");
      setText("");
    }
  };

  return (
    <section className="mt-8 rounded-2xl border bg-white p-6 border-[#ffeaf4]">
      <div className="mb-5">
        <h2 className="font-extrabold text-lg">Share your thoughts! We'd love to hear them!</h2>
        <p className="text-sm text-gray-600 mt-1">Tell us your favourite flavours and ideas and see them come to life!</p>
      </div>
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="block text-sm font-semibold mb-2" htmlFor="community-suggestion">What should we make next?</label>
          <textarea
            id="community-suggestion"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Share a flavor, format, or packaging idea"
            rows={4}
            maxLength={500}
            required
            className="w-full rounded-2xl border px-4 py-3 text-sm"
          />
          <p className="text-xs text-gray-500 text-right">{text.length}/500</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="block text-sm font-semibold mb-2" htmlFor="community-suggestion-name">Name</label>
            <input
              id="community-suggestion-name"
              value={authorName}
              onChange={(event) => setAuthorName(event.target.value)}
              placeholder="Your name"
              maxLength={60}
              required
              className="w-full rounded-full border px-4 py-2 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={controller.mutationId === "create" || !participantReady}
            className="rounded-full px-5 py-2 text-sm font-semibold text-white bg-[#FF89CC] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {controller.mutationId === "create" ? "Sending…" : "Submit suggestion"}
          </button>
        </div>
      </form>
      <div aria-live="polite" className="mt-3">
        {controller.error && <p className="text-sm text-red-700">{controller.error}</p>}
        {controller.feedback && <p className="text-sm text-green-700">{controller.feedback}</p>}
      </div>
      <div className="mt-6 border-t pt-5 border-[#f4ddea]">
        <h3 className="font-semibold mb-3">Latest suggestions</h3>
        {controller.loading ? <p className="text-sm text-gray-600">Loading suggestions…</p> : null}
        {!controller.loading && controller.error && !controller.suggestions.length ? (
          <button type="button" onClick={() => void controller.retry()} className="text-sm font-semibold underline">Retry suggestions</button>
        ) : null}
        {!controller.loading && !controller.suggestions.length && !controller.error ? (
          <p className="text-sm text-gray-600">No suggestions yet. Be first to drop one.</p>
        ) : null}
        {controller.suggestions.length ? (
          <div className="max-h-[32rem] overflow-y-auto pr-1 space-y-3" data-testid="suggestions-scroll-area">
            {controller.suggestions.map((item) => (
              <article key={item.id} className="rounded-2xl border px-4 py-3 border-[#f4ddea] bg-[#fffdfd]">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{item.authorName}</p>
                  <div className="flex items-center gap-2">
                    <time className="text-xs text-gray-500" dateTime={item.createdAt}>{timestamp(item.createdAt)}</time>
                    {item.canDelete === true && (
                      <button
                        type="button"
                        disabled={controller.mutationId === item.id}
                        onClick={() => void controller.remove(item.id)}
                        className="text-xs font-semibold text-pink-600 hover:underline disabled:opacity-50"
                      >
                        {controller.mutationId === item.id ? "Removing…" : "Remove"}
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-800 whitespace-pre-wrap">{item.text}</p>
              </article>
            ))}
            {controller.hasMore && (
              <button
                type="button"
                onClick={() => void controller.loadMore()}
                disabled={controller.loadingMore}
                className="w-full rounded-full border px-4 py-2 text-sm font-semibold disabled:opacity-60"
              >
                {controller.loadingMore ? "Loading…" : "Show more"}
              </button>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}

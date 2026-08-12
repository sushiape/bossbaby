import { OPTIONS, packMaterial } from "../model/options";
import { percentageMap } from "../model/percentages";
import type { VoteCategory, VoteResults } from "../model/types";

interface ResultsPanelProps {
  results: VoteResults | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export function ResultsPanel({ results, loading, error, onRetry }: ResultsPanelProps) {
  return (
    <div className="rounded-2xl border bg-white p-6 border-[#ffeaf4]">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h2 className="font-extrabold">Live results</h2>
        {results && <span className="text-xs text-gray-500">{results.totalParticipants} participants</span>}
      </div>
      {loading && !results ? <p className="text-sm text-gray-600">Loading results…</p> : null}
      {error && !results ? (
        <div role="alert" className="text-sm text-red-700">
          <p>{error}</p>
          <button type="button" className="mt-2 underline font-semibold" onClick={onRetry}>Retry</button>
        </div>
      ) : null}
      {results && (
        <div className="space-y-4">
          {(["pack", "flavour"] as VoteCategory[]).map((category) => {
            const options = OPTIONS[category];
            const percentages = percentageMap(options, results.counts[category] ?? {});
            return (
              <div key={category}>
                <h3 className="text-sm font-semibold mb-2">{category === "pack" ? "Bottle type" : "Flavour"}</h3>
                <div className="space-y-2">
                  {options.map((option) => {
                    const percent = percentages[option] ?? 0;
                    const [title, subtitle] = option.split("·").map((part) => part.trim());
                    return (
                      <div key={option} className="flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-sm font-semibold">{title}</span>
                            {category === "pack" ? (
                              <span className="text-xs px-3 py-1 rounded-full bg-white border border-gray-200">{packMaterial(option)}</span>
                            ) : (
                              <span className="text-xs text-gray-500">{percent}%</span>
                            )}
                          </div>
                          {subtitle && <p className="text-xs text-gray-600 mb-2">{subtitle}</p>}
                          <div className="h-2 bg-[#f1f1f1] rounded overflow-hidden" aria-label={`${title}: ${percent}%`}>
                            <div style={{ width: `${percent}%` }} className="h-2 bg-black" />
                          </div>
                        </div>
                        {category === "pack" && <span className="text-xs w-10 text-right">{percent}%</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

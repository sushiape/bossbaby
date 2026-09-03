import { useCallback, useEffect, useState } from "react";
import { fetchSurveyResponses } from "../api/staffApi";
import { STAFF_THEME } from "../model/theme";
import type { ResponseFilter, ResponsePage } from "../model/types";

/**
 * The individual submissions, verbatim.
 *
 * Kept behind its own request rather than folded into the results payload: the
 * counts view stays a fixed size however many responses accumulate, and this
 * grows with every one of them. It is also the only place a free-text answer
 * can be read in full — the results view groups and truncates, and the
 * one-off answer nobody predicted is exactly what that loses.
 */

interface SurveyResponsesProps {
  surveyKey: string;
  /** The same filter the counts above use, so both describe one set. */
  filter: ResponseFilter | null;
}

function formatWhen(value: string): string {
  return new Date(value).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function SurveyResponses({ surveyKey, filter }: SurveyResponsesProps) {
  const [page, setPage] = useState<ResponsePage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (cursor: string | null) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchSurveyResponses(surveyKey, { cursor, filter });
      // Appending rather than replacing: paging through is reading further
      // down one list, not moving between pages.
      setPage((current) =>
        current && cursor
          ? { ...result, responses: [...current.responses, ...result.responses] }
          : result
      );
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not load responses.");
    } finally {
      setLoading(false);
    }
  }, [surveyKey, filter]);

  useEffect(() => {
    setPage(null);
    void load(null);
  }, [load]);

  if (error) {
    return <p className="text-sm text-red-700 px-6 py-4">{error}</p>;
  }
  if (!page) {
    return <p className="text-sm text-black/50 px-6 py-4">Loading responses…</p>;
  }
  if (page.responses.length === 0) {
    return <p className="text-sm text-black/50 px-6 py-4">No responses yet.</p>;
  }

  return (
    <div className="px-6 pb-5">
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left text-xs text-black/50">
              <th className="py-2 pr-4 font-medium whitespace-nowrap">Submitted</th>
              {page.questions.map((question) => (
                <th key={question.key} className="py-2 pr-4 font-medium">
                  {question.prompt}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {page.responses.map((response) => (
              <tr
                key={response.id}
                className="border-t align-top"
                style={{ borderColor: STAFF_THEME.border }}
              >
                <td className="py-2 pr-4 text-black/60 whitespace-nowrap">
                  {formatWhen(response.createdAt)}
                </td>
                {page.questions.map((question) => (
                  <td key={question.key} className="py-2 pr-4 text-black">
                    {response.answers[question.key] || (
                      <span className="text-black/30">—</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-3 mt-3">
        <p className="text-xs text-black/50">
          Showing {page.responses.length} of {page.total}
        </p>
        {page.nextCursor && (
          <button
            type="button"
            onClick={() => void load(page.nextCursor)}
            disabled={loading}
            className="text-xs px-3 py-1.5 rounded border disabled:opacity-50"
            style={{ borderColor: STAFF_THEME.border }}
          >
            {loading ? "Loading…" : "Load more"}
          </button>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { fetchSurveys, fetchSurveyResults } from "../api/staffApi";
import { bespokeViewFor } from "../model/surveyViews";
import { STAFF_THEME } from "../model/theme";
import type { SurveyResults as Results, SurveySummary } from "../model/types";
import SurveyQuestionResult from "./SurveyQuestionResult";
import SurveyResponses from "./SurveyResponses";

/**
 * The Surveys tab: pick a survey, read its counts.
 *
 * A list rather than a hardcoded survey, because a closed survey is exactly
 * when you want to read results, and `is_open` defaults to false. Counts load
 * with the survey; the individual responses are a separate request behind a
 * toggle, so this stays fast as responses accumulate.
 */

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function SurveyPicker({
  surveys,
  selected,
  onSelect,
}: {
  surveys: SurveySummary[];
  selected: string | null;
  onSelect: (key: string) => void;
}) {
  return (
    <ul className="divide-y" style={{ borderColor: STAFF_THEME.border }}>
      {surveys.map((survey) => {
        const active = survey.key === selected;
        return (
          <li key={survey.key} style={{ borderColor: STAFF_THEME.border }}>
            <button
              type="button"
              onClick={() => onSelect(survey.key)}
              aria-current={active ? "true" : undefined}
              className={`w-full text-left px-4 py-3 transition-colors ${
                active ? "bg-black/[0.04]" : "hover:bg-black/[0.02]"
              }`}
            >
              <span className="block text-sm font-medium text-black">{survey.title}</span>
              <span className="block text-xs text-black/50 mt-0.5">
                {survey.isOpen ? "Open" : "Closed"} · {survey.responseCount} response
                {survey.responseCount === 1 ? "" : "s"} · {formatDate(survey.createdAt)}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export default function SurveyResults() {
  const [surveys, setSurveys] = useState<SurveySummary[] | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [results, setResults] = useState<Results | null>(null);
  const [showResponses, setShowResponses] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const list = await fetchSurveys();
        setSurveys(list);
        // Newest first from the API, so the first row is the survey most
        // likely to be the one you came to read.
        if (list.length > 0) setSelected(list[0].key);
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "Could not load surveys.");
      }
    })();
  }, []);

  useEffect(() => {
    if (!selected) return;
    setResults(null);
    setShowResponses(false);
    void (async () => {
      try {
        setResults(await fetchSurveyResults(selected));
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "Could not load results.");
      }
    })();
  }, [selected]);

  if (error) {
    return (
      <section
        className="bg-white border rounded-lg px-6 py-5"
        style={{ borderColor: STAFF_THEME.border }}
      >
        <p className="text-sm text-red-700">{error}</p>
      </section>
    );
  }

  if (!surveys) {
    return <p className="text-sm text-black/60">Loading surveys…</p>;
  }

  if (surveys.length === 0) {
    return (
      <section
        className="bg-white border rounded-lg px-6 py-5"
        style={{ borderColor: STAFF_THEME.border }}
      >
        <p className="text-sm text-black/60">No surveys exist yet.</p>
      </section>
    );
  }

  const Bespoke = selected ? bespokeViewFor(selected) : null;

  return (
    <div className="grid gap-5 md:grid-cols-[16rem_1fr] items-start">
      <aside
        className="bg-white border rounded-lg overflow-hidden"
        style={{ borderColor: STAFF_THEME.border }}
      >
        <SurveyPicker surveys={surveys} selected={selected} onSelect={setSelected} />
      </aside>

      <section
        className="bg-white border rounded-lg"
        style={{ borderColor: STAFF_THEME.border }}
      >
        {!results && <p className="text-sm text-black/50 px-6 py-5">Loading results…</p>}

        {results && (
          <>
            <header
              className="px-6 py-4 border-b"
              style={{ borderColor: STAFF_THEME.border }}
            >
              <h3 className="text-base font-semibold text-black">{results.title}</h3>
              <p className="text-xs text-black/50 mt-1">
                {results.isOpen ? "Open" : "Closed"} · {results.responseCount} response
                {results.responseCount === 1 ? "" : "s"} · started{" "}
                {formatDate(results.createdAt)}
                {results.closesAt && ` · closed ${formatDate(results.closesAt)}`}
              </p>
              {results.purpose && (
                <p className="text-xs text-black/60 mt-2">{results.purpose}</p>
              )}
            </header>

            {/* Additive by design: the generic counts below always render. */}
            {Bespoke && (
              <div className="px-6 pt-5">
                <Bespoke results={results} />
              </div>
            )}

            <div className="px-6 divide-y" style={{ borderColor: STAFF_THEME.border }}>
              {results.questions.map((question) => (
                <SurveyQuestionResult
                  key={question.key}
                  question={question}
                  responseCount={results.responseCount}
                />
              ))}
            </div>

            <div className="border-t" style={{ borderColor: STAFF_THEME.border }}>
              <button
                type="button"
                onClick={() => setShowResponses((open) => !open)}
                aria-expanded={showResponses}
                className="w-full text-left px-6 py-3 text-sm text-black/70 hover:text-black"
              >
                {showResponses ? "Hide" : "Show"} individual responses
              </button>
              {showResponses && selected && <SurveyResponses surveyKey={selected} />}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

import { useEffect, useState } from "react";
import { fetchSurveys, fetchSurveyResults } from "../api/staffApi";
import { bespokeViewFor } from "../model/surveyViews";
import { STAFF_THEME } from "../model/theme";
import type {
  FilterableQuestion,
  ResponseFilter,
  SurveyResults as Results,
  SurveySummary,
} from "../model/types";
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

/**
 * Breaks results down by one single_choice answer.
 *
 * The questions offered come from the survey itself, so this is "filter by any
 * question with fixed options" rather than a hardcoded demographic — the next
 * breakdown someone asks for needs no new component.
 */
function ResultsFilter({
  filters,
  value,
  onChange,
}: {
  filters: FilterableQuestion[];
  value: ResponseFilter | null;
  onChange: (next: ResponseFilter | null) => void;
}) {
  if (filters.length === 0) return null;

  const selectedValue = value ? `${value.questionKey}::${value.value}` : "";

  return (
    <label className="flex items-center gap-2 text-xs text-black/60">
      Filter
      <select
        value={selectedValue}
        onChange={(event) => {
          const raw = event.target.value;
          if (!raw) return onChange(null);
          const [questionKey, ...rest] = raw.split("::");
          onChange({ questionKey, value: rest.join("::") });
        }}
        className="border rounded px-2 py-1 text-xs bg-white"
        style={{ borderColor: STAFF_THEME.border }}
      >
        <option value="">Everyone</option>
        {filters.map((question) => (
          <optgroup key={question.key} label={question.prompt}>
            {question.options.map((option) => (
              <option key={option} value={`${question.key}::${option}`}>
                {option}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </label>
  );
}

export default function SurveyResults() {
  const [surveys, setSurveys] = useState<SurveySummary[] | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [results, setResults] = useState<Results | null>(null);
  // Off by default: landing on a filtered view would show a subset without
  // saying so. Narrowing stays a deliberate act.
  const [filter, setFilter] = useState<ResponseFilter | null>(null);
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

  // A filter names a question of the survey it was chosen in, so changing
  // survey clears it rather than carrying a key the new survey may not ask.
  useEffect(() => {
    setFilter(null);
  }, [selected]);

  useEffect(() => {
    if (!selected) return;
    setResults(null);
    setShowResponses(false);
    void (async () => {
      try {
        setResults(await fetchSurveyResults(selected, filter));
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "Could not load results.");
      }
    })();
  }, [selected, filter]);

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
                {results.isOpen ? "Open" : "Closed"} ·{" "}
                {/* A narrowed view always says what it narrowed from, so a
                    halved sample cannot pass for a whole one. */}
                {filter
                  ? `${results.responseCount} of ${results.totalResponseCount} responses`
                  : `${results.responseCount} response${
                    results.responseCount === 1 ? "" : "s"
                  }`}{" "}
                · started {formatDate(results.createdAt)}
                {results.closesAt && ` · closed ${formatDate(results.closesAt)}`}
              </p>
              <div className="mt-3">
                <ResultsFilter
                  filters={results.filters}
                  value={filter}
                  onChange={setFilter}
                />
              </div>
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
              {showResponses && selected && (
                <SurveyResponses surveyKey={selected} filter={filter} />
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

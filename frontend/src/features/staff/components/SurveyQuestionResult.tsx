import { STAFF_THEME } from "../model/theme";
import type { QuestionResult, Tally } from "../model/types";

/**
 * One question's results, rendered from the question set alone.
 *
 * Nothing here knows any survey. It switches on `type`, and a type it does not
 * recognise falls through to a plain note rather than throwing — a fourth
 * question type added to the backend should make one question uninformative,
 * not take the tab down. This is what lets a brand-new survey appear in the
 * dashboard with no frontend change, the same way the participant-facing popup
 * renders whatever question set the surveys endpoint publishes.
 */

interface SurveyQuestionResultProps {
  question: QuestionResult;
  /** Total responses to the survey, so a per-question n can be compared to it. */
  responseCount: number;
}

function CountBar({ entry, of }: { entry: Tally; of: number }) {
  // Share of the largest count, not of the total: with multi_choice the totals
  // exceed the response count, and a bar scaled to a total would misread.
  const width = of > 0 ? Math.round((entry.count / of) * 100) : 0;

  return (
    <li className="flex items-center gap-3 text-sm">
      <span className="w-40 shrink-0 truncate text-black/80" title={entry.label}>
        {entry.label}
      </span>
      <span className="flex-1 h-2 rounded bg-black/5 overflow-hidden">
        <span
          className="block h-full rounded"
          style={{ width: `${width}%`, backgroundColor: STAFF_THEME.accent }}
        />
      </span>
      <span className="w-10 shrink-0 text-right tabular-nums text-black">{entry.count}</span>
    </li>
  );
}

function CountList({ entries }: { entries: Tally[] }) {
  if (entries.length === 0) {
    return <p className="text-sm text-black/50">No answers yet.</p>;
  }
  const largest = entries.reduce((top, entry) => Math.max(top, entry.count), 0);
  return (
    <ul className="space-y-1.5">
      {entries.map((entry) => <CountBar key={entry.label} entry={entry} of={largest} />)}
    </ul>
  );
}

export default function SurveyQuestionResult({
  question,
  responseCount,
}: SurveyQuestionResultProps) {
  const isChoice = question.tallies !== undefined;
  const isText = question.answers !== undefined;

  // multi_choice sums above the response count because one person may pick
  // several. Saying so beats letting the numbers look wrong.
  const multiSelect = isChoice &&
    (question.tallies ?? []).reduce((sum, entry) => sum + entry.count, 0) > question.answered;

  const hidden = isText ? (question.distinctAnswers ?? 0) - (question.answers?.length ?? 0) : 0;

  return (
    <section className="py-4">
      <header className="mb-3">
        <h4 className="text-sm font-semibold text-black">{question.prompt}</h4>
        <p className="text-xs text-black/50 mt-0.5">
          {question.answered} of {responseCount} answered
          {multiSelect && " · people could pick more than one"}
          {isText && (question.distinctAnswers ?? 0) > 0 &&
            ` · ${question.distinctAnswers} distinct answer${
              question.distinctAnswers === 1 ? "" : "s"
            }`}
        </p>
      </header>

      {isChoice && <CountList entries={question.tallies ?? []} />}

      {isText && (
        <>
          <CountList entries={question.answers ?? []} />
          {hidden > 0 && (
            <p className="text-xs text-black/50 mt-2">
              {hidden} less common answer{hidden === 1 ? "" : "s"} not shown — open
              the individual responses below to read them.
            </p>
          )}
        </>
      )}

      {!isChoice && !isText && (
        <p className="text-sm text-black/50">
          This question is a “{question.type}”, which this view does not know how to
          summarise yet. The individual responses below still show the answers.
        </p>
      )}
    </section>
  );
}

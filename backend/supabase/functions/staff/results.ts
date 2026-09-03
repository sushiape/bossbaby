import { parseQuestions } from "../surveys/validation.ts";
import type { Question } from "../surveys/types.ts";
import type {
  QuestionResult,
  ResponseRow,
  SurveyResults,
  SurveyRowForResults,
  TextAnswerGroup,
  Tally,
} from "./types.ts";

/**
 * Counting answers, in the one place that already knows what an answer looks
 * like.
 *
 * ADR 0017 makes survey_responses.answers opaque to the database so a new
 * survey is an insert rather than a migration. The cost it names is exactly
 * this: results cannot be aggregated in SQL, because counting an option means
 * first reading the question set to learn which key it used. So the counting
 * lives beside validateSubmission, which already re-reads that question set on
 * every submit, rather than in a view that would have to be migrated per
 * survey.
 *
 * The direction of the walk matters and is deliberately the same as the
 * validator's: iterate the QUESTION SET, never the stored answers. A blob that
 * somehow holds a key the survey does not ask is ignored rather than reported,
 * so a dashboard can never be made to display an arbitrary string by writing
 * one into a response.
 */

/** How many text answers the frequency list carries before "show all". */
const TEXT_GROUP_LIMIT = 20;

type AnswerBlob = Record<string, unknown>;

function answersOf(row: ResponseRow): AnswerBlob {
  const value = row.answers;
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value as AnswerBlob;
}

/**
 * Counts one choice question.
 *
 * Options come from the question set, so every option appears even when nobody
 * picked it — a zero is a finding, and a list that silently omits unchosen
 * options makes "nobody wanted the big one" indistinguishable from "we forgot
 * to offer it". Answers that match no current option are dropped: they can only
 * come from a question set edited under the exception the freeze trigger
 * allows, and attributing them to an option nobody read would be a fiction.
 */
function tallyChoice(question: Question, rows: ResponseRow[]): Tally[] {
  const counts = new Map<string, number>();
  for (const option of question.options ?? []) counts.set(option, 0);

  for (const row of rows) {
    const value = answersOf(row)[question.key];
    const chosen = typeof value === "string"
      ? [value]
      : Array.isArray(value)
      ? value.filter((entry): entry is string => typeof entry === "string")
      : [];

    // multi_choice may repeat a value in a tampered blob; one response counts
    // once toward an option regardless.
    for (const option of new Set(chosen)) {
      const current = counts.get(option);
      if (current !== undefined) counts.set(option, current + 1);
    }
  }

  return (question.options ?? []).map((option) => ({
    label: option,
    count: counts.get(option) ?? 0,
  }));
}

/**
 * Groups free-text answers by frequency.
 *
 * Grouping is case-insensitive on the trimmed string, so "Mango" and "mango"
 * are one flavour. The label shown is the most common original spelling rather
 * than a lowercased version, because these are words people wrote and the
 * dashboard should show them as written; ties fall to the first seen, which
 * makes the output stable for a given ordering rather than arbitrary.
 *
 * The long tail is the point of a text question — the answer nobody thought to
 * put in an options list arrives here with a count of 1 — so the truncated
 * remainder is reported rather than dropped, and the verbatim list behind
 * /responses is what you read to actually find it.
 */
function groupText(question: Question, rows: ResponseRow[]): {
  groups: TextAnswerGroup[];
  distinct: number;
  answered: number;
} {
  const groups = new Map<string, { count: number; spellings: Map<string, number> }>();
  let answered = 0;

  for (const row of rows) {
    const value = answersOf(row)[question.key];
    if (typeof value !== "string") continue;
    const text = value.trim();
    if (!text) continue;

    answered += 1;
    const normalised = text.toLowerCase();
    const group = groups.get(normalised) ?? { count: 0, spellings: new Map() };
    group.count += 1;
    group.spellings.set(text, (group.spellings.get(text) ?? 0) + 1);
    groups.set(normalised, group);
  }

  const ranked = [...groups.values()]
    .map((group) => {
      let label = "";
      let best = -1;
      for (const [spelling, uses] of group.spellings) {
        if (uses > best) {
          best = uses;
          label = spelling;
        }
      }
      return { label, count: group.count };
    })
    // Count descending, then alphabetical, so equal counts do not reshuffle
    // between requests.
    .sort((left, right) =>
      right.count - left.count || left.label.localeCompare(right.label)
    );

  return {
    groups: ranked.slice(0, TEXT_GROUP_LIMIT),
    distinct: ranked.length,
    answered,
  };
}

/** Whether a question was answered at all, for the per-question n. */
function answeredCount(question: Question, rows: ResponseRow[]): number {
  let answered = 0;
  for (const row of rows) {
    const value = answersOf(row)[question.key];
    if (typeof value === "string" ? value.trim() !== "" : Array.isArray(value) && value.length > 0) {
      answered += 1;
    }
  }
  return answered;
}

/**
 * Builds the counts view for one survey.
 *
 * Fixed size regardless of how many responses exist: it returns prompts,
 * labels, and numbers, never the response rows themselves. That is what lets
 * the tab load instantly while the individual submissions stay behind a
 * separate paginated request.
 */
export function summariseSurvey(survey: SurveyRowForResults, rows: ResponseRow[]): SurveyResults {
  const questions = parseQuestions(survey.questions, survey.key);

  const results: QuestionResult[] = questions.map((question) => {
    const answered = answeredCount(question, rows);

    if (question.type === "text") {
      const { groups, distinct } = groupText(question, rows);
      return {
        key: question.key,
        type: question.type,
        prompt: question.prompt,
        answered,
        answers: groups,
        distinctAnswers: distinct,
      };
    }

    return {
      key: question.key,
      type: question.type,
      prompt: question.prompt,
      answered,
      // multi_choice tallies sum above the response count by design: one
      // person may pick several. The frontend says so rather than hiding it.
      tallies: tallyChoice(question, rows),
    };
  });

  return {
    key: survey.key,
    title: survey.title,
    purpose: survey.purpose,
    isOpen: survey.is_open,
    createdAt: survey.created_at,
    closesAt: survey.closes_at,
    responseCount: rows.length,
    questions: results,
  };
}

/**
 * Renders stored answers against their question set for the verbatim list.
 *
 * Walks the question set for the same reason summariseSurvey does, so a row
 * shows the survey's questions in their display order and nothing else.
 */
export function describeResponses(
  survey: SurveyRowForResults,
  rows: ResponseRow[],
): { questions: { key: string; prompt: string }[]; responses: unknown[] } {
  const questions = parseQuestions(survey.questions, survey.key);

  return {
    questions: questions.map((question) => ({ key: question.key, prompt: question.prompt })),
    responses: rows.map((row) => {
      const answers = answersOf(row);
      const rendered: Record<string, string> = {};
      for (const question of questions) {
        const value = answers[question.key];
        rendered[question.key] = typeof value === "string"
          ? value
          : Array.isArray(value)
          ? value.filter((entry) => typeof entry === "string").join(", ")
          : "";
      }
      return {
        id: row.id,
        createdAt: row.created_at,
        answers: rendered,
      };
    }),
  };
}

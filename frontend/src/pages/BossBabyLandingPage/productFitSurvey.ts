import type { SurveyAnswer, SurveyQuestion } from "../../shared/services/surveysApi";

/**
 * The family the landing page runs. The only survey identifier the frontend
 * hardcodes: which *version* is open is the backend's answer, so superseding
 * this survey does not need a deploy.
 */
export const PRODUCT_FIT_FAMILY = "product_fit";

/** Marks a visitor as having already been shown the popup once. */
export const AUTO_OPEN_STORAGE_KEY = "bossbaby.productFitSurvey.autoOpened";

/**
 * Answers in progress, keyed by question. Loosely typed on purpose: the
 * question set arrives at runtime, so a draft can outlive the questions that
 * produced it. `answersForSubmission` is where that is reconciled.
 */
export type SurveyDraft = Record<string, SurveyAnswer>;

/**
 * Applies one option tap.
 *
 * Single choice replaces, and re-picking the same option clears it, so an
 * accidental tap is undoable rather than permanent. Clearing a required
 * question is allowed here and caught at submit by `missingRequired` -- the
 * alternative, refusing the untap, would trap someone in a wrong answer.
 * Multi choice accumulates. Either way an emptied answer drops its key rather
 * than leaving `""` or `[]` behind, because the backend treats those as
 * unanswered anyway and a bare key is noise in the response blob.
 */
export function toggleChoice(
  draft: SurveyDraft,
  question: SurveyQuestion,
  option: string,
): SurveyDraft {
  const next = { ...draft };

  if (question.type === "multi_choice") {
    const current = Array.isArray(next[question.key]) ? (next[question.key] as string[]) : [];
    const chosen = current.includes(option)
      ? current.filter((item) => item !== option)
      : [...current, option];
    if (chosen.length === 0) delete next[question.key];
    else next[question.key] = chosen;
    return next;
  }

  if (next[question.key] === option) delete next[question.key];
  else next[question.key] = option;
  return next;
}

/**
 * The answers to post, reconciled against the question set as it stands now.
 *
 * validateSubmission refuses any key its survey does not ask, so a draft
 * carrying a key from a question set that has since been superseded would fail
 * the whole submission. Iterating the questions rather than the draft mirrors
 * the backend and keeps that from happening.
 */
export function answersForSubmission(
  questions: SurveyQuestion[],
  draft: SurveyDraft,
): Record<string, SurveyAnswer> {
  const answers: Record<string, SurveyAnswer> = {};

  for (const question of questions) {
    const value = draft[question.key];
    if (value === undefined) continue;

    if (typeof value === "string") {
      const text = value.trim();
      if (text) answers[question.key] = text;
      continue;
    }
    if (value.length > 0) answers[question.key] = value;
  }

  return answers;
}

/**
 * The keys of the required questions still unanswered.
 *
 * The browser enforces `required` on the text inputs and the email field, but a
 * choice question is a group of buttons, which carries no native validation --
 * so submitting would otherwise send an incomplete response that the backend
 * rejects with a message naming no question in particular. Checking here lets
 * the popup point at the ones that need an answer.
 *
 * Reuses `answersForSubmission` rather than reading the draft directly, so what
 * counts as answered is decided in exactly one place: a whitespace-only text
 * answer is missing here for the same reason it is dropped there.
 */
export function missingRequired(
  questions: SurveyQuestion[],
  draft: SurveyDraft,
): string[] {
  const answers = answersForSubmission(questions, draft);
  return questions
    .filter((question) => question.required && answers[question.key] === undefined)
    .map((question) => question.key);
}

/**
 * Whether a failed submission is worth submitting again unchanged.
 *
 * A 4xx is the backend's considered judgement on these exact answers, so
 * resubmitting them produces the same refusal -- telling the participant to try
 * again would invite an unbounded loop. Anything else (a 5xx, a dropped
 * connection reported as status 0) is transient, and retrying is exactly right:
 * both calls are idempotent, so the half that already succeeded absorbs the
 * repeat.
 */
export function isRetryable(status: number): boolean {
  return status < 400 || status >= 500;
}

/** What caused the popup to open. */
export type OpenTrigger = "timer" | "hero_button";

/**
 * Whether this opening spends the visitor's one automatic showing.
 *
 * Only the timer does. The hero button is an explicit request, and letting it
 * mark the visitor as seen would mean tapping the CTA in the first three
 * seconds quietly cancels an auto-open that never happened.
 */
export function marksVisitorSeen(trigger: OpenTrigger): boolean {
  return trigger === "timer";
}

/**
 * Whether the timer may open the popup.
 *
 * Once per visitor, never while they are mid-interaction, and never over a
 * popup that is already open. Stealing focus from someone typing their email
 * into the hero form is worse than not showing the survey at all, and firing
 * behind an open popup would spend the visitor's one automatic showing on a
 * popup they are already looking at. The hero button is subject to none of
 * these -- an explicit tap always opens it, which is what lets a second person
 * on one device take the survey.
 */
export function shouldAutoOpen(
  { alreadySeen, userIsInteracting, isOpen }: {
    alreadySeen: boolean;
    userIsInteracting: boolean;
    isOpen: boolean;
  },
): boolean {
  return !alreadySeen && !userIsInteracting && !isOpen;
}

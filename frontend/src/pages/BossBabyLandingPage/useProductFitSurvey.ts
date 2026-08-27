import { useCallback, useEffect, useRef, useState } from "react";
import {
  fetchOpenSurvey,
  submitSurveyResponse,
  type Survey,
  type SurveyQuestion,
} from "../../shared/services/surveysApi";
import { createWaitlistSubscription } from "../../shared/services/waitlistApi";
import {
  answersForSubmission,
  AUTO_OPEN_STORAGE_KEY,
  marksVisitorSeen,
  PRODUCT_FIT_FAMILY,
  shouldAutoOpen,
  toggleChoice,
  type OpenTrigger,
  type SurveyDraft,
} from "./productFitSurvey";

const INTERACTIVE_SELECTOR = "input, textarea, select, button, [contenteditable='true']";
const AUTO_OPEN_DELAY_MS = 3_000;
// A suppressed attempt waits rather than giving up: someone typing at the three
// second mark should still be offered the survey once they stop, not silently
// skipped for the whole visit.
const AUTO_OPEN_RETRY_MS = 5_000;

export type SurveyLoadStatus = "idle" | "loading" | "ready" | "failed";
export type SurveySubmitStatus = "idle" | "submitting" | "submitted" | "failed";

/** localStorage is unavailable in private modes and blocked-storage browsers. */
function readAlreadySeen(): boolean {
  try {
    return window.localStorage.getItem(AUTO_OPEN_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function markSeen(): void {
  try {
    window.localStorage.setItem(AUTO_OPEN_STORAGE_KEY, "true");
  } catch {
    // A visitor whose browser refuses storage sees the popup again next visit.
    // That is a better failure than not showing it at all.
  }
}

export function useProductFitSurvey() {
  const [isOpen, setIsOpen] = useState(false);
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loadStatus, setLoadStatus] = useState<SurveyLoadStatus>("idle");
  const [draft, setDraft] = useState<SurveyDraft>({});
  const [email, setEmail] = useState("");
  const [submitStatus, setSubmitStatus] = useState<SurveySubmitStatus>("idle");

  // Minted per opening and never persisted. Reused across retries within one
  // attempt, which is what makes a retry a replacement rather than a second
  // response (ADR 0017). A fresh id per opening means a second person on the
  // same device gets their own row instead of overwriting the first.
  const participantId = useRef<string>("");

  const load = useCallback(async () => {
    setLoadStatus("loading");
    try {
      setSurvey(await fetchOpenSurvey(PRODUCT_FIT_FAMILY));
      setLoadStatus("ready");
    } catch {
      setSurvey(null);
      setLoadStatus("failed");
    }
  }, []);

  // A fresh participant id per opening, so a second person on one device gets
  // their own row rather than replacing the first person's.
  const open = useCallback((trigger: OpenTrigger = "hero_button") => {
    participantId.current = crypto.randomUUID();
    setDraft({});
    setEmail("");
    setSubmitStatus("idle");
    setIsOpen(true);
    if (marksVisitorSeen(trigger)) markSeen();
    // Fetched when the popup opens, not at page load: a visitor who never opens
    // it should not pay for a request they do not use.
    void load();
  }, [load]);

  const close = useCallback(() => setIsOpen(false), []);

  /**
   * The timed opening, once per visitor.
   *
   * Only this path marks the visitor as having seen the popup -- opening it
   * from the hero button is an explicit request and must not spend the one
   * automatic showing. A suppressed attempt reschedules instead of returning,
   * so being mid-sentence at the three second mark postpones the survey rather
   * than cancelling it.
   */
  useEffect(() => {
    if (readAlreadySeen()) return undefined;

    let timer = 0;
    const attempt = () => {
      if (readAlreadySeen()) return;
      const active = document.activeElement;
      const userIsInteracting = active instanceof HTMLElement &&
        active.matches(INTERACTIVE_SELECTOR);
      if (!shouldAutoOpen({ alreadySeen: false, userIsInteracting })) {
        timer = window.setTimeout(attempt, AUTO_OPEN_RETRY_MS);
        return;
      }
      open("timer");
    };

    timer = window.setTimeout(attempt, AUTO_OPEN_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [open]);

  const choose = useCallback((question: SurveyQuestion, option: string) => {
    setDraft((current) => toggleChoice(current, question, option));
  }, []);

  const writeText = useCallback((question: SurveyQuestion, value: string) => {
    setDraft((current) => ({ ...current, [question.key]: value }));
  }, []);

  /**
   * Answers first, then the address (ADR 0017): the answers are what the
   * participant came to give, and a failed waitlist write can be retried
   * without risking them.
   *
   * Which of the two failed is deliberately not reported. Both are idempotent
   * on a retry -- the response upserts on the participant id, the waitlist
   * upsert ignores duplicates -- so "try again" is the whole recovery, and
   * naming the half that failed would only ask the participant to reason about
   * a distinction that changes nothing they do.
   */
  const submit = useCallback(async () => {
    if (!survey) return;
    setSubmitStatus("submitting");
    try {
      await submitSurveyResponse(
        survey.key,
        participantId.current,
        answersForSubmission(survey.questions, draft),
      );
      await createWaitlistSubscription(email, "survey");
      setSubmitStatus("submitted");
    } catch {
      setSubmitStatus("failed");
    }
  }, [survey, draft, email]);

  return {
    choose,
    close,
    draft,
    email,
    isOpen,
    loadStatus,
    open,
    retryLoad: load,
    setEmail,
    submit,
    submitStatus,
    survey,
    writeText,
  };
}

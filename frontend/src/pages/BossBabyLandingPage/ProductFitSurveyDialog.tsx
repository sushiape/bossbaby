import { useEffect, useRef, type FormEvent, type KeyboardEvent, type MouseEvent } from "react";
import { motion } from "framer-motion";
import type { SurveyQuestion } from "../../shared/services/surveysApi";
import type { SurveyDraft } from "./productFitSurvey";
import type { SurveyLoadStatus, SurveySubmitStatus } from "./useProductFitSurvey";

const FOCUSABLE_SELECTOR =
  "button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex='-1'])";

const TILE_CLASS =
  "mb-4 rounded-[20px] border border-white/90 bg-white/70 p-6 shadow-[0_8px_24px_rgba(163,79,126,0.08)]";
const OPTION_CLASS =
  "rounded-2xl border-[1.5px] px-5 py-3.5 text-left text-[15px] font-bold text-black transition focus:outline-none focus:ring-4 focus:ring-[#FF4FA3]/55";
const FIELD_CLASS =
  "w-full rounded-2xl border-[1.5px] border-black/10 bg-white px-5 py-4 text-base font-medium text-black outline-none transition placeholder:text-black/30 focus:border-[#FF89CC] focus:ring-4 focus:ring-[#FF89CC]/20";

interface ProductFitSurveyDialogProps {
  isOpen: boolean;
  survey: { title: string; purpose: string | null; questions: SurveyQuestion[] } | null;
  loadStatus: SurveyLoadStatus;
  submitStatus: SurveySubmitStatus;
  draft: SurveyDraft;
  email: string;
  onChoose: (question: SurveyQuestion, option: string) => void;
  onWriteText: (question: SurveyQuestion, value: string) => void;
  onEmailChange: (value: string) => void;
  onSubmit: () => void;
  onRetryLoad: () => void;
  onClose: () => void;
}

function isChosen(draft: SurveyDraft, question: SurveyQuestion, option: string): boolean {
  const value = draft[question.key];
  return Array.isArray(value) ? value.includes(option) : value === option;
}

export function ProductFitSurveyDialog({
  isOpen,
  survey,
  loadStatus,
  submitStatus,
  draft,
  email,
  onChoose,
  onWriteText,
  onEmailChange,
  onSubmit,
  onRetryLoad,
  onClose,
}: ProductFitSurveyDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previouslyFocused = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }
    if (event.key !== "Tab" || !dialogRef.current) return;

    const focusable = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const dismissFromBackdrop = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  const isSubmitted = submitStatus === "submitted";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#2a111f]/65 p-5 backdrop-blur-md"
      role="presentation"
      onMouseDown={dismissFromBackdrop}
    >
      <motion.div
        ref={dialogRef}
        className="relative flex h-[92vh] w-full max-w-[720px] flex-col overflow-hidden rounded-[24px] border border-white/80 shadow-[0_30px_90px_rgba(70,15,48,0.35)] sm:rounded-[32px]"
        style={{ background: "linear-gradient(145deg, #FFD6E9 0%, #FFE8F2 58%, #FFFFFF 100%)" }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-fit-survey-title"
        onKeyDown={handleKeyDown}
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
      >
        {/* The tag carries the auto margin, not the close button, so the gap
            opens after the wordmark and the tag rides alongside the ×. */}
        <div className="flex flex-none items-center gap-1.5 border-b border-white/60 px-4 pb-3.5 pt-5 sm:gap-2 sm:px-[30px] sm:pb-[18px] sm:pt-[26px]">
          <span className="flex-none text-[21px] font-extrabold tracking-[-0.04em] text-black sm:text-2xl">
            bossbaby
          </span>
          <span className="ml-auto flex-none whitespace-nowrap rounded-full bg-black px-[9px] py-[5px] text-[9px] font-extrabold uppercase tracking-[0.09em] text-white sm:px-3 sm:text-[10px] sm:tracking-[0.16em]">
            help us build it
          </span>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-white/80 bg-white/65 text-xl font-bold leading-none text-black/60 transition hover:bg-white hover:text-black focus:outline-none focus:ring-4 focus:ring-white/80 sm:h-10 sm:w-10"
            aria-label="Close survey"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-7 pt-[22px] sm:px-[30px] sm:pb-[34px] sm:pt-7">
          {loadStatus === "loading" && (
            <p className="py-10 text-center text-[15px] font-medium text-black/45">
              Loading the questions…
            </p>
          )}

          {loadStatus === "failed" && (
            <div className="py-10 text-center">
              <p className="mb-5 text-[15px] font-medium text-black/60">
                Something went wrong. Please try again.
              </p>
              <button
                type="button"
                onClick={onRetryLoad}
                className="rounded-full border-[1.5px] border-black/10 bg-white px-[26px] py-3 text-sm font-bold text-black transition hover:border-[#FF89CC]"
              >
                Try again
              </button>
            </div>
          )}

          {loadStatus === "ready" && survey && !isSubmitted && (
            <>
              <div className="mb-[26px]">
                <h1
                  id="product-fit-survey-title"
                  className="mb-2.5 text-[26px] font-extrabold leading-[1.1] tracking-[-0.03em] text-black sm:text-[34px]"
                >
                  {survey.title}
                </h1>
                {survey.purpose && (
                  <p className="text-[15px] font-medium leading-[1.55] text-black/60">
                    {survey.purpose}
                  </p>
                )}
              </div>

              <form onSubmit={handleSubmit}>
                {survey.questions.map((question, index) => (
                  <QuestionTile
                    key={question.key}
                    question={question}
                    number={index + 1}
                    draft={draft}
                    onChoose={onChoose}
                    onWriteText={onWriteText}
                  />
                ))}

                {/* Not a Question: an address is never a survey answer
                    (ADR 0017), so it is posted to the waitlist separately. */}
                <div className="mb-4 rounded-[20px] border border-black bg-black p-6 shadow-[0_8px_24px_rgba(163,79,126,0.08)]">
                  <p className="mb-[18px] flex flex-wrap items-center gap-[11px] text-xl font-extrabold leading-[1.25] tracking-[-0.02em] text-white">
                    <span className="whitespace-nowrap rounded-full bg-[#FF89CC]/20 px-[11px] py-[5px] text-[11px] font-extrabold tracking-[0.1em] text-[#FF89CC]">
                      {String(survey.questions.length + 1).padStart(2, "0")}
                    </span>
                    One last thing
                  </p>
                  <p className="-mt-2.5 mb-4 text-[13px] font-medium text-white/55">
                    Join our waitlist — we'll email you when Bossbaby launches.
                  </p>
                  <div className="flex flex-col gap-[11px] sm:flex-row">
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => onEmailChange(event.target.value)}
                      className={`${FIELD_CLASS} flex-1 border-transparent`}
                      placeholder="Enter your email address…"
                      aria-label="Email address"
                      autoComplete="email"
                      required
                    />
                    <button
                      type="submit"
                      disabled={submitStatus === "submitting"}
                      className="inline-flex items-center justify-center gap-[9px] whitespace-nowrap rounded-2xl bg-[#FF89CC] px-[30px] py-4 text-base font-extrabold text-black shadow-[0_10px_26px_rgba(255,137,204,0.34)] transition hover:-translate-y-0.5 hover:bg-white focus:outline-none focus:ring-4 focus:ring-[#FF89CC]/85 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {submitStatus === "submitting" ? "Sending…" : "Submit"}
                      {submitStatus !== "submitting" && <span aria-hidden="true">→</span>}
                    </button>
                  </div>
                  {/* One generic message for either half of the two-call
                      submit: both are idempotent, so "try again" is the whole
                      recovery and which one failed changes nothing. A rejection
                      is the exception -- the same answers would be refused
                      again, so it must not invite a retry. */}
                  {submitStatus === "failed" && (
                    <p className="mt-4 text-sm font-semibold text-[#FF89CC]" role="alert">
                      Something went wrong. Please try again.
                    </p>
                  )}
                  {submitStatus === "rejected" && (
                    <p className="mt-4 text-sm font-semibold text-[#FF89CC]" role="alert">
                      We couldn't accept those answers. Please check them and your email address.
                    </p>
                  )}
                </div>
              </form>
            </>
          )}

          {isSubmitted && (
            <output className="block pb-1 pt-5 text-center">
              <h2
                id="product-fit-survey-title"
                className="mb-2.5 text-[32px] font-extrabold tracking-[-0.03em] text-black"
              >
                You're on the list ✨
              </h2>
              <p className="mb-5 text-[15px] font-medium text-black/45">
                Thank you — your answers help decide what we build.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border-[1.5px] border-black/10 bg-white px-[26px] py-3 text-sm font-bold text-black transition hover:border-[#FF89CC]"
              >
                Done
              </button>
            </output>
          )}
        </div>
      </motion.div>
    </div>
  );
}

interface QuestionTileProps {
  question: SurveyQuestion;
  number: number;
  draft: SurveyDraft;
  onChoose: (question: SurveyQuestion, option: string) => void;
  onWriteText: (question: SurveyQuestion, value: string) => void;
}

/**
 * One question, rendered from whatever the backend published.
 *
 * Every branch here is on `question.type`, never on a question key: a
 * superseding survey may ask anything the three types cover and this renders it
 * without a deploy.
 */
function QuestionTile({ question, number, draft, onChoose, onWriteText }: QuestionTileProps) {
  const label = String(number).padStart(2, "0");
  const isChoice = question.type === "single_choice" || question.type === "multi_choice";
  const titleId = `product-fit-q-${question.key}`;

  const title = (
    <p
      id={titleId}
      className="mb-[18px] flex flex-wrap items-center gap-[11px] text-xl font-extrabold leading-[1.25] tracking-[-0.02em] text-black"
    >
      <span className="whitespace-nowrap rounded-full bg-[#FF89CC]/[0.18] px-[11px] py-[5px] text-[11px] font-extrabold tracking-[0.1em] text-[#FF4FA3]">
        {label}
      </span>
      {question.prompt}
    </p>
  );

  const hint = question.hint && (
    <p className="-mt-2.5 mb-4 text-[13px] font-medium text-black/45">{question.hint}</p>
  );

  if (!isChoice) {
    return (
      <div className={TILE_CLASS}>
        {title}
        {hint}
        <input
          type="text"
          value={typeof draft[question.key] === "string" ? (draft[question.key] as string) : ""}
          onChange={(event) => onWriteText(question, event.target.value)}
          maxLength={question.maxLength}
          className={FIELD_CLASS}
          placeholder="Type your answer…"
          aria-labelledby={titleId}
          required={question.required}
        />
      </div>
    );
  }

  return (
    <div className={TILE_CLASS} role="group" aria-labelledby={titleId}>
      {title}
      {hint}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
        {question.options?.map((option) => {
          const chosen = isChosen(draft, question, option);
          return (
            <button
              key={option}
              type="button"
              aria-pressed={chosen}
              onClick={() => onChoose(question, option)}
              className={`${OPTION_CLASS} ${
                chosen
                  ? "border-[#FF89CC] bg-[#FF89CC] shadow-[0_8px_22px_rgba(255,137,204,0.4)]"
                  : "border-black/[0.07] bg-white hover:-translate-y-0.5 hover:border-[#FF89CC]/55 hover:shadow-[0_8px_24px_rgba(163,79,126,0.08)]"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

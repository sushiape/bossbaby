import { useEffect, useRef, type KeyboardEvent, type MouseEvent } from "react";
import { motion } from "framer-motion";
import {
  moodQuizQuestions,
  moodResults,
  type MoodKey,
  type MoodQuizQuestionKey,
} from "./moodQuiz";

const FOCUSABLE_SELECTOR =
  "button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex='-1'])";

interface MoodQuizDialogProps {
  isOpen: boolean;
  step: number;
  resultKey: MoodKey;
  onAnswer: (key: MoodQuizQuestionKey, value: MoodKey) => void;
  onBack: () => void;
  onClose: () => void;
  onReset: () => void;
}

export function MoodQuizDialog({
  isOpen,
  step,
  resultKey,
  onAnswer,
  onBack,
  onClose,
  onReset,
}: MoodQuizDialogProps) {
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

  const result = moodResults[resultKey];
  const isResult = step >= moodQuizQuestions.length;
  const question = moodQuizQuestions[Math.min(step, moodQuizQuestions.length - 1)];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#2a111f]/65 p-3 backdrop-blur-md sm:p-5"
      role="presentation"
      onMouseDown={dismissFromBackdrop}
    >
      <motion.div
        ref={dialogRef}
        className="relative my-auto max-h-[calc(100vh-1.5rem)] w-full max-w-2xl overflow-y-auto rounded-[32px] border border-white/80 p-6 text-left shadow-[0_30px_90px_rgba(70,15,48,0.35)] sm:max-h-[calc(100vh-2.5rem)] sm:p-9"
        style={{ background: "linear-gradient(145deg, #FFD6E9 0%, #FFE8F2 58%, #FFFFFF 100%)" }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mood-quiz-title"
        onKeyDown={handleKeyDown}
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/80 bg-white/65 text-xl font-bold text-black/60 shadow-sm backdrop-blur-md transition hover:bg-white hover:text-black focus:outline-none focus:ring-4 focus:ring-white/80"
          aria-label="Close mood quiz"
        >
          ×
        </button>

        <div className="relative mb-8 flex items-center gap-3 pr-12">
          <span className="text-2xl font-extrabold tracking-[-0.04em] text-black">bossbaby</span>
          <span className="rounded-full bg-black px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-white">
            mood finder
          </span>
        </div>

        {!isResult ? (
          <div className="relative">
            <div className="mb-4 flex items-center justify-between gap-4">
              <p id="mood-quiz-title" className="text-xs font-extrabold uppercase tracking-[0.18em] text-black/45">
                Find your perfect match
              </p>
              <p className="rounded-full bg-white/65 px-3 py-1 text-xs font-extrabold text-black/55 shadow-sm">
                0{step + 1} / 0{moodQuizQuestions.length}
              </p>
            </div>

            <div className="mb-8 h-2 overflow-hidden rounded-full bg-white/65 shadow-inner" aria-hidden="true">
              <div
                className="h-full rounded-full bg-[#FF89CC] shadow-sm transition-all duration-300"
                style={{ width: `${((step + 1) / moodQuizQuestions.length) * 100}%` }}
              />
            </div>

            <fieldset>
              <legend className="mb-6 max-w-lg text-3xl font-extrabold leading-[1.08] tracking-[-0.025em] text-black sm:text-4xl">
                {question.question}
              </legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {question.options.map((option) => (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => onAnswer(question.key, option.value)}
                    className="group flex min-h-[72px] items-center justify-between gap-4 rounded-[20px] border border-white/90 bg-white/70 px-5 py-4 text-left text-sm font-extrabold text-black shadow-[0_8px_24px_rgba(163,79,126,0.08)] transition hover:-translate-y-1 hover:bg-white focus:outline-none focus:ring-4 focus:ring-white/80"
                  >
                    <span>{option.label}</span>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FF89CC] text-base text-white transition group-hover:translate-x-0.5" aria-hidden="true">
                      →
                    </span>
                  </button>
                ))}
              </div>
            </fieldset>

            {step > 0 && (
              <button
                type="button"
                onClick={onBack}
                className="mt-6 rounded-full border border-black/10 bg-white/45 px-4 py-2 text-sm font-bold text-black/55 transition hover:bg-white hover:text-black"
              >
                Back
              </button>
            )}
          </div>
        ) : (
          <div className="relative" aria-live="polite">
            <p
              id="mood-quiz-title"
              className="mb-4 inline-block rounded-full px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-black shadow-sm"
              style={{ backgroundColor: result.color }}
            >
              {result.eyebrow}
            </p>
            <h2 className="mb-3 text-4xl font-extrabold leading-none tracking-[-0.035em] text-black sm:text-5xl">
              {result.name}
            </h2>
            <p className="mb-7 max-w-lg leading-relaxed text-black/60">{result.description}</p>
            <p className="mb-7 text-xs font-semibold text-black/45">
              If your answers split evenly, what you want today leads your match.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onReset}
                className="rounded-full border border-black/10 bg-white/65 px-5 py-3 text-sm font-bold text-black transition hover:bg-white"
              >
                Retake quiz
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-black px-5 py-3 text-sm font-extrabold text-white transition hover:bg-gray-900"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

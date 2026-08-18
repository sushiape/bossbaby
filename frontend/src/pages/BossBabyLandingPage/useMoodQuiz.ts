import { useEffect, useRef, useState } from "react";
import {
  getMoodResult,
  moodQuizQuestions,
  shouldOpenTimedQuiz,
  type MoodKey,
  type MoodQuizAnswers,
  type MoodQuizQuestionKey,
} from "./moodQuiz";

const INTERACTIVE_SELECTOR = "input, textarea, select, button, [contenteditable='true']";

export function useMoodQuiz(autoOpenDelayMs = 10_000) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<MoodQuizAnswers>({});
  const [isOpen, setIsOpen] = useState(false);
  const hasOpened = useRef(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const activeElement = document.activeElement;
      const userIsInteracting =
        activeElement instanceof HTMLElement && activeElement.matches(INTERACTIVE_SELECTOR);
      if (!shouldOpenTimedQuiz(hasOpened.current, userIsInteracting)) return;
      hasOpened.current = true;
      setIsOpen(true);
    }, autoOpenDelayMs);

    return () => window.clearTimeout(timer);
  }, [autoOpenDelayMs]);

  const open = () => {
    hasOpened.current = true;
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);

  const answer = (key: MoodQuizQuestionKey, value: MoodKey) => {
    setAnswers((current) => ({ ...current, [key]: value }));
    setStep((current) => Math.min(current + 1, moodQuizQuestions.length));
  };

  const back = () => setStep((current) => Math.max(current - 1, 0));

  const reset = () => {
    setAnswers({});
    setStep(0);
  };

  return {
    answers,
    answer,
    back,
    close,
    isOpen,
    open,
    reset,
    resultKey: getMoodResult(answers),
    step,
  };
}

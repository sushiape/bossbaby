export const moodKeys = ["power", "energy", "glow", "calm"] as const;

export type MoodKey = (typeof moodKeys)[number];
export type MoodQuizQuestionKey = "goal" | "moment" | "ritual";
export type MoodQuizAnswers = Partial<Record<MoodQuizQuestionKey, MoodKey>>;

export interface MoodQuizQuestion {
  key: MoodQuizQuestionKey;
  question: string;
  options: ReadonlyArray<{ label: string; value: MoodKey }>;
}

export interface MoodResult {
  name: string;
  eyebrow: string;
  description: string;
  color: string;
}

export const moodQuizQuestions: ReadonlyArray<MoodQuizQuestion> = [
  {
    key: "goal",
    question: "What do you want more of today?",
    options: [
      { label: "Get-up-and-go energy", value: "power" },
      { label: "Clear, locked-in focus", value: "energy" },
      { label: "A fresh, radiant feeling", value: "glow" },
      { label: "A calmer headspace", value: "calm" },
    ],
  },
  {
    key: "moment",
    question: "When do you need your reset most?",
    options: [
      { label: "First thing in the morning", value: "power" },
      { label: "During the 3pm slump", value: "energy" },
      { label: "Before I go out", value: "glow" },
      { label: "When the day winds down", value: "calm" },
    ],
  },
  {
    key: "ritual",
    question: "Which ritual sounds most like you?",
    options: [
      { label: "Workout, shower, go", value: "power" },
      { label: "Coffee, laptop, deep work", value: "energy" },
      { label: "Skincare and getting ready", value: "glow" },
      { label: "Tea, music, switch off", value: "calm" },
    ],
  },
];

export const moodResults: Record<MoodKey, MoodResult> = {
  power: {
    name: "Power up, Babe.",
    eyebrow: "Your mood match: Power",
    description: "Your answers point to a bold, get-up-and-go ritual for ambitious days.",
    color: "#F3AFC3",
  },
  energy: {
    name: "Lock in, Babe.",
    eyebrow: "Your mood match: Energy",
    description: "Your answers point to a sharp little ritual for busy, tab-filled days.",
    color: "#F79A3E",
  },
  glow: {
    name: "Glow up, Babe.",
    eyebrow: "Your mood match: Glow",
    description: "Your answers point to a bright ritual that belongs beside your skincare favorites.",
    color: "#F9D44A",
  },
  calm: {
    name: "Just chill, Babe.",
    eyebrow: "Your mood match: Calm",
    description: "Your answers point to a softer ritual for slowing down and making space.",
    color: "#8BC374",
  },
};

export function getMoodResult(answers: MoodQuizAnswers): MoodKey {
  const scores: Record<MoodKey, number> = { power: 0, energy: 0, glow: 0, calm: 0 };
  Object.values(answers).forEach((answer) => {
    if (answer) scores[answer] += 1;
  });

  // The explicit daily goal is the documented tie-break when the answers split evenly.
  return moodKeys.reduce(
    (best, mood) => (scores[mood] > scores[best] ? mood : best),
    answers.goal ?? "power",
  );
}

export function shouldOpenTimedQuiz(hasOpened: boolean, userIsInteracting: boolean): boolean {
  return !hasOpened && !userIsInteracting;
}

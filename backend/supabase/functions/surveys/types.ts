/**
 * A question as it is stored in surveys.questions.
 *
 * This is the structured half of ADR 0017: the database and this function both
 * read it, so it has a shape. The answers it produces do not.
 */
export type QuestionType = "single_choice" | "multi_choice" | "text";

export interface Question {
  key: string;
  type: QuestionType;
  prompt: string;
  hint?: string;
  options?: string[];
  required?: boolean;
  maxLength?: number;
}

export interface SurveyRow {
  key: string;
  family: string;
  supersedes: string | null;
  title: string;
  purpose: string | null;
  questions: unknown;
  is_open: boolean;
  created_at: string;
  closes_at: string | null;
}

/** A survey as the frontend renders it. */
export interface SurveyResource {
  key: string;
  family: string;
  title: string;
  purpose: string | null;
  questions: PublicQuestion[];
}

export interface PublicQuestion {
  key: string;
  type: QuestionType;
  prompt: string;
  hint?: string;
  options?: string[];
  required: boolean;
  maxLength?: number;
}

export type AnswerValue = string | string[];

/** The answers one submission contributes to the opaque response blob. */
export interface ValidatedSubmission {
  answers: Record<string, AnswerValue>;
}

export interface SubmissionResult {
  status: "recorded";
  surveyKey: string;
}

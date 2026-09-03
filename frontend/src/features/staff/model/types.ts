export interface CapabilityDescription {
  name: string;
  description: string;
}

/** Mirrors the `staff` Edge Function's GET /me payload. */
export interface StaffAccess {
  userId: string;
  email: string | null;
  capabilities: CapabilityDescription[];
}

export type WorkspaceTab = "waitlist" | "surveys" | "access";

export interface WaitlistSubscription {
  id: string;
  email: string;
  source: string;
  createdAt: string;
}

export interface SubscriptionPage {
  subscriptions: WaitlistSubscription[];
  total: number;
  nextCursor: string | null;
}

export interface RejectedImportLine {
  line: number;
  value: string;
  reason: string;
}

export interface ImportSummary {
  added: number;
  skippedDuplicate: number;
  rejected: RejectedImportLine[];
}

/** A row in the survey list. */
export interface SurveySummary {
  key: string;
  title: string;
  isOpen: boolean;
  createdAt: string;
  closesAt: string | null;
  responseCount: number;
}

export interface Tally {
  label: string;
  count: number;
}

/**
 * One question's results.
 *
 * `type` is a bare string rather than a union of the three known types on
 * purpose: a fourth question type added to the backend must render as a
 * fallback here, not narrow to `never` and crash the tab.
 */
export interface QuestionResult {
  key: string;
  type: string;
  prompt: string;
  answered: number;
  tallies?: Tally[];
  answers?: Tally[];
  distinctAnswers?: number;
}

export interface SurveyResults {
  key: string;
  title: string;
  purpose: string | null;
  isOpen: boolean;
  createdAt: string;
  closesAt: string | null;
  responseCount: number;
  questions: QuestionResult[];
}

export interface SurveyResponse {
  id: string;
  createdAt: string;
  answers: Record<string, string>;
}

export interface ResponsePage {
  questions: { key: string; prompt: string }[];
  responses: SurveyResponse[];
  total: number;
  nextCursor: string | null;
}

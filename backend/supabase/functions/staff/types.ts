export interface CapabilityDescription {
  name: string;
  description: string;
}

export interface StaffAccess {
  userId: string;
  email: string | null;
  capabilities: CapabilityDescription[];
}

export interface StaffRepository {
  describeCapabilities(names: string[]): Promise<CapabilityDescription[]>;
}

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

export interface SubscriptionQuery {
  search: string | null;
  limit: number;
  cursor: string | null;
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

export interface SubscriptionRepository {
  listSubscriptions(query: SubscriptionQuery): Promise<SubscriptionPage>;
  /** Returns the emails that were newly inserted; duplicates are skipped. */
  importSubscriptions(emails: string[], staffUserId: string): Promise<string[]>;
  removeSubscription(id: string): Promise<boolean>;
}

/** The columns the results views read from a surveys row. */
export interface SurveyRowForResults {
  key: string;
  title: string;
  purpose: string | null;
  questions: unknown;
  is_open: boolean;
  created_at: string;
  closes_at: string | null;
}

/** One stored response, answers still opaque (ADR 0017). */
export interface ResponseRow {
  id: string;
  answers: unknown;
  created_at: string;
}

export interface Tally {
  label: string;
  count: number;
}

export interface TextAnswerGroup {
  label: string;
  count: number;
}

/**
 * One question's results. Choice questions carry tallies, text questions carry
 * grouped answers; the frontend switches on `type` and renders a plain fallback
 * for a type it does not know, so a fourth question type degrades rather than
 * crashes the tab.
 */
export interface QuestionResult {
  key: string;
  type: string;
  prompt: string;
  /** Per-question n: how many responses answered this one. */
  answered: number;
  tallies?: Tally[];
  answers?: TextAnswerGroup[];
  /** Distinct text answers before truncation, so the tail is visible as a number. */
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

/** A row in the survey list: enough to choose one, nothing more. */
export interface SurveySummary {
  key: string;
  title: string;
  isOpen: boolean;
  createdAt: string;
  closesAt: string | null;
  responseCount: number;
}

export interface ResponseQuery {
  limit: number;
  cursor: string | null;
}

export interface ResponsePage {
  questions: { key: string; prompt: string }[];
  responses: unknown[];
  total: number;
  nextCursor: string | null;
}

export interface SurveyResultsRepository {
  listSurveys(): Promise<SurveySummary[]>;
  findSurvey(key: string): Promise<SurveyRowForResults | null>;
  /** Every response for one survey. Bounded by the counts view's own use. */
  allResponses(surveyKey: string): Promise<ResponseRow[]>;
  pageResponses(
    surveyKey: string,
    query: ResponseQuery,
  ): Promise<{ rows: ResponseRow[]; total: number; nextCursor: string | null }>;
}

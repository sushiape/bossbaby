import { requireSupabaseConfig } from "../../lib/supabaseClient";

interface ErrorPayload {
  error?: { code?: string; message?: string; details?: Record<string, string> };
}

export type SurveyQuestionType = "single_choice" | "multi_choice" | "text";

/** One question as the Edge Function publishes it. Mirrors PublicQuestion. */
export interface SurveyQuestion {
  key: string;
  type: SurveyQuestionType;
  prompt: string;
  hint?: string;
  options?: string[];
  required: boolean;
  maxLength?: number;
}

export interface Survey {
  key: string;
  family: string;
  title: string;
  purpose: string | null;
  questions: SurveyQuestion[];
}

/** An answer is whatever its question's type produces: one option, several, or text. */
export type SurveyAnswer = string | string[];

export class SurveysApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: Record<string, string>,
  ) {
    super(message);
    this.name = "SurveysApiError";
  }
}

async function surveysRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const { url, anonKey } = requireSupabaseConfig();
  const response = await fetch(`${url}/functions/v1/surveys${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      apikey: anonKey,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    let payload: ErrorPayload = {};
    try {
      payload = (await response.json()) as ErrorPayload;
    } catch {
      // Gateway failures may not return the service's JSON error contract.
    }
    throw new SurveysApiError(
      response.status,
      payload.error?.code ?? "REQUEST_FAILED",
      payload.error?.message ?? "Survey service request failed.",
      payload.error?.details,
    );
  }

  return (await response.json()) as T;
}

/**
 * The version of a survey that is currently open.
 *
 * The frontend knows which survey it is running but not which version, so it
 * asks by family and renders whatever question set comes back. That is what
 * lets a superseding survey go live without a deploy.
 */
export async function fetchOpenSurvey(family: string): Promise<Survey> {
  const { survey } = await surveysRequest<{ survey: Survey }>(
    `/open?family=${encodeURIComponent(family)}`,
  );
  return survey;
}

/**
 * Records one participant's answers against the exact survey they answered.
 *
 * The key comes from the fetched survey rather than the family, so a survey
 * superseded between opening the popup and submitting is refused rather than
 * filed against wording nobody read.
 */
export async function submitSurveyResponse(
  surveyKey: string,
  participantId: string,
  answers: Record<string, SurveyAnswer>,
): Promise<void> {
  await surveysRequest(`/${encodeURIComponent(surveyKey)}/responses`, {
    method: "POST",
    body: JSON.stringify({ participantId, answers }),
  });
}

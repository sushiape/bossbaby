import { ApiError } from "../_shared/errors.ts";
import type { SurveyRepository } from "./repository.ts";
import type {
  PublicQuestion,
  Question,
  SubmissionResult,
  SurveyResource,
  SurveyRow,
} from "./types.ts";
import { parseQuestions, participantId, validateSubmission } from "./validation.ts";

function isOpen(survey: SurveyRow): boolean {
  if (!survey.is_open) return false;
  return !survey.closes_at || Date.parse(survey.closes_at) > Date.now();
}

function notFound(): ApiError {
  return new ApiError(404, "NOT_FOUND", "This survey is not open.");
}

/** The frontend gets the wording and the options it needs to render. */
function toResource(survey: SurveyRow, questions: Question[]): SurveyResource {
  return {
    key: survey.key,
    family: survey.family,
    title: survey.title,
    purpose: survey.purpose,
    questions: questions.map((question): PublicQuestion => ({
      key: question.key,
      type: question.type,
      prompt: question.prompt,
      ...(question.hint ? { hint: question.hint } : {}),
      ...(question.options ? { options: question.options } : {}),
      required: question.required === true,
      ...(question.maxLength ? { maxLength: question.maxLength } : {}),
    })),
  };
}

export async function getOpenSurvey(
  repository: SurveyRepository,
  family: string,
): Promise<SurveyResource> {
  const survey = await repository.findOpenByFamily(family);
  if (!survey || !isOpen(survey)) throw notFound();
  return toResource(survey, parseQuestions(survey.questions, survey.key));
}

export async function getSurvey(
  repository: SurveyRepository,
  key: string,
): Promise<SurveyResource> {
  const survey = await repository.findByKey(key);
  if (!survey || !isOpen(survey)) throw notFound();
  return toResource(survey, parseQuestions(survey.questions, survey.key));
}

/**
 * Records one response against the exact survey it was answered on.
 *
 * The key is taken from the caller rather than resolved from the family again:
 * a survey superseded between render and submit must reject the response, not
 * silently file it against wording the participant never saw.
 *
 * Idempotent on (survey key, participant id): a resubmission replaces rather
 * than adds, so a client that retries a failed submit does not double-count
 * itself. That holds only while the client reuses one participant id across
 * retries -- a fresh id is a second response, not a replacement.
 */
export async function submitResponse(
  repository: SurveyRepository,
  surveyKey: string,
  body: unknown,
  verifiedParticipant: string | null,
): Promise<SubmissionResult> {
  const survey = await repository.findByKey(surveyKey);
  if (!survey || !isOpen(survey)) throw notFound();

  const questions = parseQuestions(survey.questions, survey.key);
  const claimed = (body as Record<string, unknown> | null)?.participantId;
  const participant = participantId(claimed, verifiedParticipant);
  const { answers } = validateSubmission(questions, body);

  await repository.saveResponse({
    surveyKey: survey.key,
    participantId: participant,
    answers,
  });

  return { status: "recorded", surveyKey: survey.key };
}

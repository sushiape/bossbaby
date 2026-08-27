import { ApiError } from "../_shared/errors.ts";
import type { AnswerValue, Question, QuestionType, ValidatedSubmission } from "./types.ts";

const DEFAULT_MAX_TEXT_LENGTH = 500;
const MAX_TEXT_LENGTH = 2000;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const QUESTION_TYPES: QuestionType[] = ["single_choice", "multi_choice", "text"];

function invalid(message: string, details?: Record<string, string>): ApiError {
  return new ApiError(400, "VALIDATION_FAILED", message, details);
}

function objectBody(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw invalid("Request body must be a JSON object.");
  }
  return value as Record<string, unknown>;
}

/**
 * Reads a stored question set into the shape this function relies on.
 *
 * surveys.questions is only checked by the database for being a non-empty
 * array, so a malformed set is a server fault rather than a bad request: it was
 * written by a developer, not submitted by a participant.
 */
export function parseQuestions(value: unknown, surveyKey: string): Question[] {
  const fail = (reason: string): never => {
    console.error("Malformed survey question set", { surveyKey, reason });
    throw new ApiError(500, "INTERNAL_ERROR", "This survey is not available.");
  };

  if (!Array.isArray(value)) return fail("questions is not an array");

  const seen = new Set<string>();
  return value.map((raw, index) => {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
      return fail(`question ${index} is not an object`);
    }
    const source = raw as Record<string, unknown>;
    const key = source.key;
    if (typeof key !== "string" || !key.trim()) return fail(`question ${index} has no key`);
    if (seen.has(key)) return fail(`duplicate question key ${key}`);
    seen.add(key);

    const type = source.type;
    if (typeof type !== "string" || !QUESTION_TYPES.includes(type as QuestionType)) {
      return fail(`question ${key} has unknown type ${String(type)}`);
    }
    const prompt = source.prompt;
    if (typeof prompt !== "string" || !prompt.trim()) return fail(`question ${key} has no prompt`);

    const question: Question = {
      key,
      type: type as QuestionType,
      prompt,
      required: source.required === true,
    };

    if (typeof source.hint === "string") question.hint = source.hint;

    if (type === "single_choice" || type === "multi_choice") {
      const options = source.options;
      if (
        !Array.isArray(options) || options.length === 0 ||
        options.some((option) => typeof option !== "string" || !option.trim())
      ) {
        return fail(`question ${key} has no usable options`);
      }
      if (new Set(options as string[]).size !== options.length) {
        return fail(`question ${key} repeats an option`);
      }
      question.options = options as string[];
    }

    if (type === "text") {
      const maxLength = source.maxLength;
      if (maxLength !== undefined) {
        if (typeof maxLength !== "number" || !Number.isInteger(maxLength) || maxLength < 1) {
          return fail(`question ${key} has an invalid maxLength`);
        }
        question.maxLength = Math.min(maxLength, MAX_TEXT_LENGTH);
      } else {
        question.maxLength = DEFAULT_MAX_TEXT_LENGTH;
      }
    }

    return question;
  });
}

/**
 * Validates one submission against its question set.
 *
 * This is the only guard on what a response may contain: the frontend is not
 * trusted, so hand-written or tampered answers are checked here against the
 * stored question set. Everything per-question happens here rather than in SQL,
 * because the database takes answers as an opaque object so that a new survey
 * is an insert, not a migration (ADR 0017). Unknown keys are refused rather
 * than ignored, so a blob can never hold a key the question set cannot
 * explain.
 */
/**
 * Reads one submission body: who is answering, and what they answered.
 *
 * Both come out of the same parse. Pulling the participant id out separately
 * would mean two readers of one body, in two modules, each casting it back to
 * an object -- and the caller carrying a raw `unknown` it should not have to
 * understand.
 */
export function validateSubmission(
  questions: Question[],
  value: unknown,
  verifiedParticipant: string | null,
): ValidatedSubmission {
  const body = objectBody(value);
  const participant = participantId(body.participantId, verifiedParticipant);
  const rawAnswers = body.answers;
  if (!rawAnswers || typeof rawAnswers !== "object" || Array.isArray(rawAnswers)) {
    throw invalid("Answers must be a JSON object.", { answers: "invalid" });
  }
  const submitted = rawAnswers as Record<string, unknown>;

  const known = new Map(questions.map((question) => [question.key, question]));
  for (const key of Object.keys(submitted)) {
    if (!known.has(key)) {
      throw invalid("Answers contain a question this survey does not ask.", { [key]: "unknown" });
    }
  }

  const answers: Record<string, AnswerValue> = {};

  // Iterating the question set rather than the body is what keeps a blob
  // explainable: a key the survey does not ask cannot reach it.
  for (const question of questions) {
    const answer = validateAnswer(question, submitted[question.key]);
    if (answer === undefined) continue;
    answers[question.key] = answer;
  }

  return { answers, participantId: participant };
}

function validateAnswer(question: Question, value: unknown): AnswerValue | undefined {
  const missing = value === undefined || value === null ||
    (typeof value === "string" && !value.trim()) ||
    (Array.isArray(value) && value.length === 0);

  if (missing) {
    if (question.required) {
      throw invalid(`"${question.prompt}" needs an answer.`, { [question.key]: "required" });
    }
    return undefined;
  }

  switch (question.type) {
    case "single_choice":
      return validateChoice(question, value);
    case "multi_choice":
      return validateChoices(question, value);
    case "text":
      return validateText(question, value);
  }
}

function validateChoice(question: Question, value: unknown): string {
  if (typeof value !== "string") {
    throw invalid(`"${question.prompt}" takes a single option.`, { [question.key]: "invalid" });
  }
  if (!question.options!.includes(value)) {
    throw invalid(`"${question.prompt}" was answered with an unknown option.`, {
      [question.key]: "unknown_option",
    });
  }
  return value;
}

function validateChoices(question: Question, value: unknown): string[] {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw invalid(`"${question.prompt}" takes a list of options.`, { [question.key]: "invalid" });
  }
  const chosen = [...new Set(value as string[])];
  if (chosen.some((option) => !question.options!.includes(option))) {
    throw invalid(`"${question.prompt}" was answered with an unknown option.`, {
      [question.key]: "unknown_option",
    });
  }
  // Ordered by the question set, not by the client, so counting later is stable.
  return question.options!.filter((option) => chosen.includes(option));
}

function validateText(question: Question, value: unknown): string {
  if (typeof value !== "string") {
    throw invalid(`"${question.prompt}" takes text.`, { [question.key]: "invalid" });
  }
  const text = value.trim();
  const max = question.maxLength ?? DEFAULT_MAX_TEXT_LENGTH;
  if (text.length > max) {
    throw invalid(`"${question.prompt}" must be at most ${max} characters.`, {
      [question.key]: "too_long",
    });
  }
  return text;
}

/**
 * The identity a response is stored against.
 *
 * A survey on the landing page has no sign-in, so an anonymous participant
 * supplies their own id and keeps it; that id is what makes resubmitting a
 * replacement rather than a second response. A verified JWT always wins over a
 * claimed id, so a signed-in participant cannot be impersonated.
 */
/**
 * The participant this response belongs to.
 *
 * A verified identity wins over anything the body claims. Absent one, the
 * claimed id is taken on trust -- it deduplicates rather than authenticates
 * (CONTEXT.md, Participant) -- but must still be a well-formed uuid, so a
 * client cannot claim an id that collides with someone else's by accident.
 */
function participantId(claimed: unknown, verified: string | null): string {
  if (verified) return verified;
  if (typeof claimed !== "string" || !UUID_PATTERN.test(claimed)) {
    throw invalid("A participant id is required.", { participantId: "invalid" });
  }
  return claimed.toLowerCase();
}

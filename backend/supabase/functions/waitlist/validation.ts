import { ApiError } from "../_shared/errors.ts";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 320;

/**
 * The channels a public signup may claim for itself.
 *
 * waitlist_subscriptions.source only checks a key's shape, so an arbitrary
 * client string would be stored verbatim and quietly widen the vocabulary the
 * team reports on. Staff Import and the Formspree transfer are deliberately
 * absent: they are not things a browser may say it is.
 */
const PUBLIC_SOURCES = ["website", "survey"] as const;
const DEFAULT_SOURCE = "website";

export type PublicSource = (typeof PUBLIC_SOURCES)[number];

function validationError(message: string): ApiError {
  return new ApiError(400, "VALIDATION_FAILED", message, { email: message });
}

export function validateSubscription(input: unknown): { email: string; source: PublicSource } {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw validationError("Enter a valid email address.");
  }

  const fields = Object.keys(input);
  if (fields.some((field) => field !== "email" && field !== "source")) {
    throw validationError("Only an email address and its source can be submitted.");
  }

  const rawEmail = (input as Record<string, unknown>).email;
  if (typeof rawEmail !== "string") {
    throw validationError("Enter a valid email address.");
  }

  const email = rawEmail.trim().toLowerCase();
  if (!email || email.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(email)) {
    throw validationError("Enter a valid email address.");
  }

  const rawSource = (input as Record<string, unknown>).source;
  if (rawSource !== undefined && !PUBLIC_SOURCES.includes(rawSource as PublicSource)) {
    throw validationError("That signup source is not recognised.");
  }

  return { email, source: (rawSource as PublicSource | undefined) ?? DEFAULT_SOURCE };
}

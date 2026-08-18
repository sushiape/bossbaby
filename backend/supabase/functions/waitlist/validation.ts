import { ApiError } from "../_shared/errors.ts";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 320;

function validationError(message: string): ApiError {
  return new ApiError(400, "VALIDATION_FAILED", message, { email: message });
}

export function validateSubscription(input: unknown): { email: string } {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw validationError("Enter a valid email address.");
  }

  const fields = Object.keys(input);
  if (fields.some((field) => field !== "email")) {
    throw validationError("Only an email address can be submitted.");
  }

  const rawEmail = (input as Record<string, unknown>).email;
  if (typeof rawEmail !== "string") {
    throw validationError("Enter a valid email address.");
  }

  const email = rawEmail.trim().toLowerCase();
  if (!email || email.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(email)) {
    throw validationError("Enter a valid email address.");
  }

  return { email };
}

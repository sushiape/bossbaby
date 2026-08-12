import { ApiError } from "../_shared/errors.ts";
import type { VoteSelections } from "./types.ts";

export const PACK_OPTIONS = [
  "100 ml Bottle · A concentrated daily shot",
  "250 ml Bottle · A small functional drink",
  "200 ml Can · Cute, compact, concentrated",
  "250 ml Can · More to sip, still sleek",
] as const;

export const FLAVOUR_OPTIONS = [
  "Mixed Berries",
  "Mango Peach",
  "Blueberry Coconut",
  "Vanilla Cream",
  "Other: Adding to Suggestions",
] as const;

function objectBody(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new ApiError(400, "VALIDATION_FAILED", "Request body must be a JSON object.");
  }
  return value as Record<string, unknown>;
}

function trimmedString(
  body: Record<string, unknown>,
  key: string,
  label: string,
  max: number,
): string {
  const value = body[key];
  if (typeof value !== "string" || !value.trim()) {
    throw new ApiError(400, "VALIDATION_FAILED", `${label} is required.`, { [key]: "required" });
  }
  const trimmed = value.trim();
  if (trimmed.length > max) {
    throw new ApiError(400, "VALIDATION_FAILED", `${label} must be at most ${max} characters.`, {
      [key]: "too_long",
    });
  }
  return trimmed;
}

export function validateSuggestion(value: unknown): { authorName: string; text: string } {
  const body = objectBody(value);
  if ("user_id" in body || "userId" in body) {
    throw new ApiError(400, "VALIDATION_FAILED", "Participant IDs are not accepted.");
  }
  return {
    authorName: trimmedString(body, "authorName", "Name", 60),
    text: trimmedString(body, "text", "Suggestion", 500),
  };
}

function stringArray(value: unknown, field: string): string[] {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new ApiError(400, "VALIDATION_FAILED", `${field} must be an array of options.`, {
      [field]: "invalid",
    });
  }
  return [...new Set(value as string[])];
}

export function validateVote(value: unknown): VoteSelections {
  const body = objectBody(value);
  if ("user_id" in body || "userId" in body) {
    throw new ApiError(400, "VALIDATION_FAILED", "Participant IDs are not accepted.");
  }
  const pack = stringArray(body.pack ?? [], "pack");
  const flavour = stringArray(body.flavour ?? [], "flavour");
  if (pack.length > 1) {
    throw new ApiError(400, "VALIDATION_FAILED", "Choose at most one pack option.", {
      pack: "too_many",
    });
  }
  if (!pack.length && !flavour.length) {
    throw new ApiError(400, "VALIDATION_FAILED", "Choose at least one pack or flavour option.");
  }
  if (pack.some((option) => !PACK_OPTIONS.includes(option as (typeof PACK_OPTIONS)[number]))) {
    throw new ApiError(400, "VALIDATION_FAILED", "Vote contains an unknown pack option.", {
      pack: "unknown_option",
    });
  }
  if (
    flavour.some((option) => !FLAVOUR_OPTIONS.includes(option as (typeof FLAVOUR_OPTIONS)[number]))
  ) {
    throw new ApiError(400, "VALIDATION_FAILED", "Vote contains an unknown flavour option.", {
      flavour: "unknown_option",
    });
  }
  return { pack, flavour };
}

export async function jsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new ApiError(400, "VALIDATION_FAILED", "Request body must contain valid JSON.");
  }
}

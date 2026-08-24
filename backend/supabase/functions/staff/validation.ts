import { ApiError } from "../_shared/errors.ts";
import type { RejectedImportLine, SubscriptionQuery } from "./types.ts";

// Same rule as the public endpoint, so an address staff can import is exactly
// an address the public form would have accepted.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 320;
const MAX_IMPORT_LINES = 1000;
const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

export interface ParsedImport {
  emails: string[];
  rejected: RejectedImportLine[];
}

/**
 * Parses pasted text, one address per line.
 *
 * A partially valid paste is not rejected wholesale: valid addresses are kept
 * and invalid ones are reported by line so the Staff Member can fix them.
 * Duplicates *within the paste* collapse here; duplicates against existing rows
 * are the repository's business.
 */
export function parseImport(raw: unknown): ParsedImport {
  if (typeof raw !== "string") {
    throw new ApiError(400, "VALIDATION_FAILED", "Paste one email address per line.");
  }

  const lines = raw.split("\n");
  if (lines.length > MAX_IMPORT_LINES) {
    throw new ApiError(
      400,
      "VALIDATION_FAILED",
      `Import at most ${MAX_IMPORT_LINES} addresses at a time.`,
    );
  }

  const emails: string[] = [];
  const rejected: RejectedImportLine[] = [];
  const seen = new Set<string>();

  lines.forEach((line, index) => {
    const value = line.trim();
    if (!value) return; // Blank lines are padding, not errors.

    const email = value.toLowerCase();
    if (email.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(email)) {
      rejected.push({ line: index + 1, value, reason: "malformed" });
      return;
    }
    if (seen.has(email)) {
      rejected.push({ line: index + 1, value, reason: "duplicate in paste" });
      return;
    }
    seen.add(email);
    emails.push(email);
  });

  return { emails, rejected };
}

/** The affirmation is the consent record; without it nothing is imported. */
export function assertConsent(body: Record<string, unknown>): void {
  if (body.consent_affirmed !== true) {
    throw new ApiError(
      400,
      "VALIDATION_FAILED",
      "Confirm that these people consented to be contacted.",
      { consent_affirmed: "Consent must be affirmed." },
    );
  }
}

export function parseSubscriptionQuery(url: URL): SubscriptionQuery {
  const rawLimit = url.searchParams.get("limit");
  let limit = DEFAULT_LIMIT;
  if (rawLimit !== null) {
    const parsed = Number(rawLimit);
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > MAX_LIMIT) {
      throw new ApiError(400, "VALIDATION_FAILED", `limit must be between 1 and ${MAX_LIMIT}.`);
    }
    limit = parsed;
  }

  const search = url.searchParams.get("search")?.trim().toLowerCase() || null;
  return { search, limit, cursor: url.searchParams.get("cursor") };
}

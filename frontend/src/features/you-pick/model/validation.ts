import { FLAVOUR_OPTIONS, PACK_OPTIONS } from "./options";
import type { VoteSelections } from "./types";

export interface ValidationResult {
  valid: boolean;
  message?: string;
}

export function validateSuggestion(authorName: string, text: string): ValidationResult {
  if (!authorName.trim()) return { valid: false, message: "Please add your name before sending." };
  if (authorName.trim().length > 60) return { valid: false, message: "Name must be 60 characters or fewer." };
  if (!text.trim()) return { valid: false, message: "Please add your suggestion before sending." };
  if (text.trim().length > 500) return { valid: false, message: "Suggestion must be 500 characters or fewer." };
  return { valid: true };
}

export function validateVote(selections: VoteSelections): ValidationResult {
  if (selections.pack.length > 1) return { valid: false, message: "Choose at most one pack." };
  if (!selections.pack.length && !selections.flavour.length) {
    return { valid: false, message: "Choose at least one pack or flavour." };
  }
  if (selections.pack.some((option) => !PACK_OPTIONS.includes(option as (typeof PACK_OPTIONS)[number]))) {
    return { valid: false, message: "Vote includes an unknown pack option." };
  }
  if (selections.flavour.some((option) => !FLAVOUR_OPTIONS.includes(option as (typeof FLAVOUR_OPTIONS)[number]))) {
    return { valid: false, message: "Vote includes an unknown flavour option." };
  }
  return { valid: true };
}

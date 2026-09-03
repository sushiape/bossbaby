import type { ComponentType } from "react";
import type { SurveyResults } from "./types";

/**
 * Bespoke views, keyed by survey key.
 *
 * The generic renderer handles any question set, which is what keeps a new
 * survey from needing frontend work. This registry is the escape hatch for the
 * survey that genuinely wants something the generic view cannot give — a chart
 * shaped to one question, a comparison only that survey's options make sense
 * of.
 *
 * Two rules keep the hatch from swallowing the rule it escapes:
 *
 * 1. A bespoke view is ADDITIVE. It renders above the generic counts, never
 *    instead of them. A custom view is written against one question set and
 *    silently misreads if that set ever changes; the generic counts underneath
 *    are always correct, so a stale custom view degrades into a redundant one
 *    rather than a wrong one.
 * 2. A missing entry is the normal case, not a gap to be filled. Every survey
 *    works without one.
 *
 * Deliberately empty. Building a bespoke view before seeing real responses is
 * guessing at which visualisation helps: if 44 of 47 people pick one option, a
 * chart says nothing a three-line list did not.
 */

export interface SurveyViewProps {
  results: SurveyResults;
}

export const BESPOKE_SURVEY_VIEWS: Record<string, ComponentType<SurveyViewProps>> = {};

export function bespokeViewFor(surveyKey: string): ComponentType<SurveyViewProps> | null {
  return BESPOKE_SURVEY_VIEWS[surveyKey] ?? null;
}

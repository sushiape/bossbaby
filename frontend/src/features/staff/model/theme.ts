/**
 * Bossbaby palette as used by the public site, named once here so the workspace
 * stays in step with it. Section 7.4 of the spec asks for white, black and
 * subtle pink in a dense, functional layout: the pink carries the page and the
 * panels stay white, so tables and forms keep their contrast.
 */
export const STAFF_THEME = {
  /** Page background, matching the public site's pages. */
  background: "#FFD2E9",
  /** Brand pink, for accents and the active state. */
  accent: "#FF89CC",
  /** Border tuned to read against the pink page rather than white. */
  border: "#F0B9D7",
} as const;

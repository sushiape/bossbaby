import { describe, expect, it } from "vitest";
import { validateSuggestion, validateVote } from "./validation";

describe("You Pick frontend validation", () => {
  it("rejects empty votes and accepts known options", () => {
    expect(validateVote({ pack: [], flavour: [] }).valid).toBe(false);
    expect(validateVote({ pack: [], flavour: ["Mango Peach"] }).valid).toBe(true);
  });

  it("rejects tampered options", () => {
    expect(validateVote({ pack: ["Fake pack"], flavour: [] }).valid).toBe(false);
  });

  it("trims semantic emptiness and enforces suggestion limits", () => {
    expect(validateSuggestion("  ", "idea").valid).toBe(false);
    expect(validateSuggestion("Ada", " ").valid).toBe(false);
    expect(validateSuggestion("a".repeat(61), "idea").valid).toBe(false);
    expect(validateSuggestion("Ada", "x".repeat(501)).valid).toBe(false);
    expect(validateSuggestion("Ada", "idea").valid).toBe(true);
  });
});

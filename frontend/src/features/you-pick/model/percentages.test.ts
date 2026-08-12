import { describe, expect, it } from "vitest";
import { largestRemainderPercentages, percentageMap } from "./percentages";

describe("largestRemainderPercentages", () => {
  it("returns percentages totaling exactly 100", () => {
    const result = largestRemainderPercentages([1, 1, 1]);
    expect(result).toEqual([34, 33, 33]);
    expect(result.reduce((sum, value) => sum + value, 0)).toBe(100);
  });

  it("returns zeros for empty participation", () => {
    expect(largestRemainderPercentages([0, 0])).toEqual([0, 0]);
  });

  it("maps counts in stable option order", () => {
    expect(percentageMap(["a", "b"], { a: 3, b: 1 })).toEqual({ a: 75, b: 25 });
  });
});

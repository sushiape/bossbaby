import assert from "node:assert/strict";
import test from "node:test";
import { getMoodResult, shouldOpenTimedQuiz } from "./BossBabyLandingPage/moodQuiz.ts";

test("mood scoring returns the majority answer", () => {
  assert.equal(getMoodResult({ goal: "power", moment: "calm", ritual: "calm" }), "calm");
});

test("mood scoring uses the daily goal to resolve a three-way tie", () => {
  assert.equal(getMoodResult({ goal: "glow", moment: "energy", ritual: "power" }), "glow");
});

test("timed opening never repeats or interrupts an active control", () => {
  assert.equal(shouldOpenTimedQuiz(false, false), true);
  assert.equal(shouldOpenTimedQuiz(true, false), false);
  assert.equal(shouldOpenTimedQuiz(false, true), false);
});

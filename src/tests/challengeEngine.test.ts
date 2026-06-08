import { describe, it, expect } from "vitest";
import { getPersonalizedChallenges } from "../lib/challengeEngine";
import { WEEKLY_CHALLENGES } from "../data/challenges";

describe("Challenge Engine", () => {
  it("returns default challenges when no top category provided", () => {
    const defaultChallenges = getPersonalizedChallenges(null);
    expect(defaultChallenges).toEqual(WEEKLY_CHALLENGES);
  });

  it("prioritizes challenges matching the top category", () => {
    const travelChallenges = getPersonalizedChallenges("travel");
    expect(travelChallenges[0].category).toBe("travel");
  });
});

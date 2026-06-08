import { describe, it, expect } from "vitest";
import { getEcoInsight } from "../lib/insightEngine";
import { CarbonSummary, Category } from "../types";

describe("Smart Insight Engine", () => {
  it("identifies travel as top category", () => {
    const summary: CarbonSummary = {
      total: 10,
      byCategory: {
        travel: 8,
        food: 2,
        electricity: 0,
        shopping: 0,
        waste: 0,
      },
      dailyHistory: {},
      weeklyTotal: 10
    };

    const insight = getEcoInsight(summary);
    expect(insight.topCategory).toBe("travel");
    expect(insight.mainInsight).toContain("Travel");
  });

  it("handles empty data with starter guidance", () => {
    const summary: CarbonSummary = {
      total: 0,
      byCategory: { travel: 0, food: 0, electricity: 0, shopping: 0, waste: 0 },
      dailyHistory: {},
      weeklyTotal: 0
    };

    const insight = getEcoInsight(summary);
    expect(insight.topCategory).toBeNull();
    expect(insight.mainInsight).toBe("Welcome to CarbonWise");
    expect(insight.starterGuidance).toBeDefined();
  });
});

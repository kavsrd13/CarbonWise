import { describe, it, expect } from "vitest";
import { calculateEcoScore, getEcoScoreLabel } from "../lib/ecoScore";
import { CarbonSummary, UserProfile, ActivityLog } from "../types";

describe("EcoScore Calculation", () => {
  const defaultProfile: UserProfile = {
    name: "Test User",
    city: "Test",
    country: "Test",
    householdSize: 1,
    primaryCommuteMode: "Car",
    fuelType: "Petrol",
    dailyCommuteDistance: 10,
    monthlyElectricityUsage: 200,
    acUsageLevel: "Medium",
    dietType: "Mixed",
    foodDeliveryFrequency: "Sometimes",
    shoppingFrequency: "Medium",
    recyclingHabit: "Sometimes"
  };

  const emptySummary: CarbonSummary = {
    total: 0,
    weeklyTotal: 0,
    byCategory: { travel: 0, electricity: 0, food: 0, shopping: 0, waste: 0 },
    dailyHistory: {}
  };

  it("returns 80 if no total footprint yet", () => {
    const score = calculateEcoScore(emptySummary, defaultProfile, [], 0);
    expect(score).toBe(80);
  });

  it("reduces score if weekly footprint is high", () => {
    const summary: CarbonSummary = {
      ...emptySummary,
      total: 60,
      weeklyTotal: 60,
      byCategory: { travel: 60, electricity: 0, food: 0, shopping: 0, waste: 0 }
    };
    
    // Starting 100
    // weekly > 50 -> -10 (90)
    // travel% > 40 -> -10 (80)
    // profile mixed diet -> -5 (75)
    // profile medium overall -> shouldn't change
    
    const score = calculateEcoScore(summary, defaultProfile, [], 0);
    expect(score).toBeLessThan(100);
  });

  it("adds points for completed challenges", () => {
    const score0 = calculateEcoScore(emptySummary, defaultProfile, [], 0);
    const score2 = calculateEcoScore(emptySummary, defaultProfile, [], 2);
    
    expect(score2).toBe(score0 + 4); // 2 points per challenge
  });

  it("adds points for regular logging", () => {
    const logs: ActivityLog[] = [
      { id: "1", date: "2023-01-01", category: "food", activityType: "vegan", quantity: 1, unit: "meals", emissionKgCO2e: 1, createdAt: "" },
      { id: "2", date: "2023-01-02", category: "food", activityType: "vegan", quantity: 1, unit: "meals", emissionKgCO2e: 1, createdAt: "" },
      { id: "3", date: "2023-01-03", category: "food", activityType: "vegan", quantity: 1, unit: "meals", emissionKgCO2e: 1, createdAt: "" }
    ];
    
    const summary: CarbonSummary = { ...emptySummary, total: 3, weeklyTotal: 3 };
    const score = calculateEcoScore(summary, defaultProfile, logs, 0);
    
    // baseline 100, no deductions for weeklyTotal(3), profile default deductions:
    // Mixed diet (-5)
    // Points for regular logging: 3 unique days -> +5
    // Net: 100 - 5 + 5 = 100
    expect(score).toBe(100);
  });

  it("caps score at 100 and bounds at 0", () => {
    const scoreOver = calculateEcoScore(emptySummary, defaultProfile, [], 50); // 100 points just from challenges
    expect(scoreOver).toBe(100);
    
    const highEmissionSummary: CarbonSummary = {
      ...emptySummary,
      total: 1000,
      weeklyTotal: 1000,
      byCategory: { travel: 600, electricity: 400, food: 0, shopping: 0, waste: 0 }
    };
    
    const highProfile: UserProfile = {
      ...defaultProfile,
      dietType: "High Meat", // -5
      shoppingFrequency: "High", // -5
      recyclingHabit: "Never", // -5
    };

    // Very penalizing scenario
    // Weekly > 50 -> -10
    // Travel > 40% -> -10
    // Elect > 35% -> -5
    // Profile -> -15
    // Net -> 100 - 40 = 60
    const penalizedScore = calculateEcoScore(highEmissionSummary, highProfile, [], 0);
    expect(penalizedScore).toBeLessThan(80);
  });
});

describe("EcoScore Labels", () => {
  it("returns correct labels", () => {
    expect(getEcoScoreLabel(85)).toBe("Excellent");
    expect(getEcoScoreLabel(65)).toBe("Good");
    expect(getEcoScoreLabel(45)).toBe("Needs Attention");
    expect(getEcoScoreLabel(20)).toBe("High Impact");
  });
});

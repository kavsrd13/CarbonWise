import { describe, it, expect } from "vitest";
import { calculateTravelEmission, calculateFoodEmission, calculateTotalFootprint } from "../lib/carbonCalculator";
import { ActivityLog } from "../types";

describe("Carbon Calculator", () => {
  it("calculates correct emission for car (petrol) 10km", () => {
    // factor is 0.19
    const result = calculateTravelEmission("car_petrol", 10);
    expect(result).toBe(1.9);
  });

  it("calculates correct emission for vegan meal", () => {
    // factor is 0.8
    const result = calculateFoodEmission("vegan", 1);
    expect(result).toBe(0.8);
  });

  it("handles negative inputs gracefully", () => {
    const result = calculateTravelEmission("car_petrol", -5);
    expect(result).toBe(0);
  });

  it("calculates total footprint summary correctly", () => {
    const mockLogs: ActivityLog[] = [
      { id: "1", category: "travel", activityType: "car_petrol", quantity: 10, unit: "km", emissionKgCO2e: 1.9, date: new Date().toISOString(), createdAt: "" },
      { id: "2", category: "food", activityType: "vegan", quantity: 1, unit: "meals", emissionKgCO2e: 0.8, date: new Date().toISOString(), createdAt: "" },
    ];
    
    const summary = calculateTotalFootprint(mockLogs);
    
    expect(summary.total).toBe(2.7);
    expect(summary.byCategory.travel).toBe(1.9);
    expect(summary.byCategory.food).toBe(0.8);
    expect(summary.byCategory.electricity).toBe(0);
  });
});

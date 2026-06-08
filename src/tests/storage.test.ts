/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { 
  getUserProfile, 
  saveUserProfile, 
  isOnboardingCompleted, 
  getActivityLogs, 
  saveActivityLog, 
  getChallengesState, 
  updateChallengeStatus, 
  clearAllData 
} from "../lib/storage";
import { UserProfile, ActivityLog } from "../types";

describe("Storage functionality", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("should return null for profile if not saved", () => {
    expect(getUserProfile()).toBeNull();
  });

  it("should save and retrieve user profile", () => {
    const profile: UserProfile = {
      name: "John Doe",
      city: "Test City",
      country: "Test Country",
      householdSize: 2,
      primaryCommuteMode: "Walk",
      fuelType: "None",
      dailyCommuteDistance: 5,
      monthlyElectricityUsage: 100,
      acUsageLevel: "Low",
      dietType: "Vegan",
      foodDeliveryFrequency: "Rare",
      shoppingFrequency: "Low",
      recyclingHabit: "Often"
    };

    saveUserProfile(profile);
    const retrieved = getUserProfile();
    expect(retrieved).not.toBeNull();
    expect(retrieved?.name).toBe("John Doe");
    expect(isOnboardingCompleted()).toBe(true);
  });

  it("should return empty array for logs if none exist", () => {
    expect(getActivityLogs()).toEqual([]);
  });

  it("should save and retrieve activity logs sorted by date descending", () => {
    const log1: ActivityLog = { id: "1", category: "travel", activityType: "walk", quantity: 5, unit: "km", emissionKgCO2e: 0, date: "2023-01-01", createdAt: new Date().toISOString() };
    const log2: ActivityLog = { id: "2", category: "food", activityType: "vegan", quantity: 1, unit: "meals", emissionKgCO2e: 0.8, date: "2023-01-03", createdAt: new Date().toISOString() };
    
    saveActivityLog(log1);
    saveActivityLog(log2);
    
    const logs = getActivityLogs();
    expect(logs.length).toBe(2);
    expect(logs[0].id).toBe("2"); // 2023-01-03 comes first
    expect(logs[1].id).toBe("1");
  });

  it("should manage challenge states", () => {
    const initialState = getChallengesState();
    expect(initialState).toEqual({ active: [], completed: [] });

    updateChallengeStatus("c1", "active");
    expect(getChallengesState().active).toContain("c1");

    updateChallengeStatus("c1", "completed");
    const newState = getChallengesState();
    expect(newState.active).not.toContain("c1");
    expect(newState.completed).toContain("c1");
  });

  it("should clear all data", () => {
    saveUserProfile({ name: "Jane" } as UserProfile);
    updateChallengeStatus("c1", "active");
    clearAllData();

    expect(getUserProfile()).toBeNull();
    expect(getChallengesState()).toEqual({ active: [], completed: [] });
    expect(isOnboardingCompleted()).toBe(false);
  });
});

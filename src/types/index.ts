export type Category = "travel" | "electricity" | "food" | "shopping" | "waste";
export type CommuteMode = "Walk" | "Cycle" | "Bike" | "Car" | "Bus" | "Train";
export type FuelType = "None" | "Petrol" | "Diesel" | "Electric";
export type DietType = "Vegetarian" | "Mixed" | "High Meat" | "Vegan";
export type Frequency = "Rare" | "Sometimes" | "Often" | "Low" | "Medium" | "High" | "Never";
export type AcUsage = "Low" | "Medium" | "High";

export interface UserProfile {
  name: string;
  city: string;
  country: string;
  householdSize: number;
  primaryCommuteMode: CommuteMode;
  fuelType: FuelType;
  dailyCommuteDistance: number;
  monthlyElectricityUsage: number;
  acUsageLevel: AcUsage;
  dietType: DietType;
  foodDeliveryFrequency: Frequency;
  shoppingFrequency: Frequency;
  recyclingHabit: Frequency;
}

export interface ActivityLog {
  id: string;
  category: Category;
  activityType: string;
  quantity: number;
  unit: string;
  emissionKgCO2e: number;
  date: string;
  createdAt: string;
}

export interface Challenge {
  id: string;
  title: string;
  category: Category;
  difficulty: "Easy" | "Medium" | "Hard";
  estimatedSaving: number;
  duration: string;
  description?: string;
  completed?: boolean;
}

export interface ActivityCategory {
  category: Category;
  totalEmissions: number;
}

export interface CarbonSummary {
  total: number;
  byCategory: Record<Category, number>;
  dailyHistory: Record<string, number>;
  weeklyTotal: number;
}

export interface EcoInsight {
  topCategory: Category | null;
  mainInsight: string;
  whyItMatters: string;
  nextBestAction: string;
  estimatedImpact: string;
  sevenDayPlan: { day: number; action: string }[];
  starterGuidance?: string;
}

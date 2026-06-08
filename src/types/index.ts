export type Category = "travel" | "electricity" | "food" | "shopping" | "waste";

export interface UserProfile {
  name: string;
  city: string;
  country: string;
  householdSize: number;
  primaryCommuteMode: string;
  fuelType: string;
  dailyCommuteDistance: number;
  monthlyElectricityUsage: number;
  acUsageLevel: string;
  dietType: string;
  foodDeliveryFrequency: string;
  shoppingFrequency: string;
  recyclingHabit: string;
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

import { ActivityLog, Category, CarbonSummary } from "../types";
import { emissionFactors } from "../data/emissionFactors";

/**
 * Calculators use simplistic, standardized global assumptions for demonstration purposes.
 * Formula: Emission (kg CO2e) = Quantity * Emission Factor.
 * E.g., 10 km walked = 10 * 0 = 0 kg CO2e.
 * 10 km driven in petrol car = 10 * 0.19 = 1.9 kg CO2e.
 * These factors are strictly mapped in src/data/emissionFactors.ts.
 */
export function calculateEmission(category: Category, type: string, quantity: number): number {
  if (quantity < 0) return 0;
  
  let factor = 0;
  if (emissionFactors[category] && emissionFactors[category][type]) {
    factor = emissionFactors[category][type];
  } else if (category === "electricity") {
    factor = emissionFactors.electricity.grid; // fallback
  }

  const result = quantity * factor;
  return Math.round(result * 100) / 100;
}

export function calculateTravelEmission(type: string, quantity: number): number {
  return calculateEmission("travel", type, quantity);
}

export function calculateElectricityEmission(quantity: number): number {
  return calculateEmission("electricity", "grid", quantity);
}

export function calculateFoodEmission(type: string, quantity: number): number {
  return calculateEmission("food", type, quantity);
}

export function calculateShoppingEmission(type: string, quantity: number): number {
  return calculateEmission("shopping", type, quantity);
}

export function calculateWasteEmission(type: string, quantity: number): number {
  return calculateEmission("waste", type, quantity);
}

export function calculateTotalFootprint(logs: ActivityLog[]): CarbonSummary {
  const byCategory: Record<Category, number> = {
    travel: 0,
    electricity: 0,
    food: 0,
    shopping: 0,
    waste: 0,
  };
  
  const dailyHistory: Record<string, number> = {};
  
  // Calculate to exactly 7 days ago for 'weeklyTotal' based on today
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  let weeklyTotal = 0;
  let total = 0;

  logs.forEach((log) => {
    byCategory[log.category] = (byCategory[log.category] || 0) + log.emissionKgCO2e;
    total += log.emissionKgCO2e;
    
    // YYYY-MM-DD
    const localDateStr = log.date; 
    dailyHistory[localDateStr] = (dailyHistory[localDateStr] || 0) + log.emissionKgCO2e;

    // simplistic weekly check (could be strict to current week, but last 7 days is fine)
    const logDate = new Date(localDateStr);
    if (logDate >= oneWeekAgo) {
      weeklyTotal += log.emissionKgCO2e;
    }
  });

  // rounding
  total = Math.round(total * 100) / 100;
  weeklyTotal = Math.round(weeklyTotal * 100) / 100;
  for (const cat of Object.keys(byCategory) as Category[]) {
    byCategory[cat] = Math.round(byCategory[cat] * 100) / 100;
  }
  for (const day in dailyHistory) {
    dailyHistory[day] = Math.round(dailyHistory[day] * 100) / 100;
  }

  return { total, byCategory, dailyHistory, weeklyTotal };
}

export function getCategoryBreakdown(summary: CarbonSummary): { name: string; value: number }[] {
  return [
    { name: "Travel", value: summary.byCategory.travel },
    { name: "Electricity", value: summary.byCategory.electricity },
    { name: "Food", value: summary.byCategory.food },
    { name: "Shopping", value: summary.byCategory.shopping },
    { name: "Waste", value: summary.byCategory.waste },
  ].filter(c => c.value > 0);
}

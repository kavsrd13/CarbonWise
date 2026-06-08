import { CarbonSummary, EcoInsight, Category } from "../types";

/**
 * Smart Insight Engine provides the deterministic "rule-based" logic for the EcoCoach.
 * Instead of pinging an expensive external LLM API, the engine identifies the 
 * highest-emitting category for the user mathematically. It then matches that 
 * category to a pre-defined subset of expert advice, serving a 'Next Best Action'
 * and a tailored 7-Day action plan logically aligned with the user's biggest impact area.
 */
export function getEcoInsight(summary: CarbonSummary): EcoInsight {
  const { byCategory, weeklyTotal } = summary;

  if (weeklyTotal === 0 || Object.keys(byCategory).length === 0) {
    return {
      topCategory: null,
      mainInsight: "Welcome to CarbonWise",
      whyItMatters: "Logging your daily habits helps you understand your environmental impact.",
      nextBestAction: "Log your first activity.",
      estimatedImpact: "Start tracking to see estimates.",
      sevenDayPlan: [],
      starterGuidance: "Add your first travel, food, or electricity activity to receive personalized carbon insights."
    };
  }

  // Find top category
  let topCategory: Category = "travel";
  let maxEmission = -1;

  for (const cat of Object.keys(byCategory) as Category[]) {
    if (byCategory[cat] > maxEmission) {
      maxEmission = byCategory[cat];
      topCategory = cat;
    }
  }
  
  if (maxEmission === 0) {
      topCategory = "travel"; // default if somehow everything is 0
  }

  const categoryTotal = Object.values(byCategory).reduce((a, b) => a + b, 0) || 1;
  const percentage = Math.round((maxEmission / categoryTotal) * 100);

  let insight: EcoInsight;

  switch (topCategory) {
    case "travel":
      insight = {
        topCategory: "travel",
        mainInsight: "Travel is your biggest source of emissions this week.",
        whyItMatters: `You logged fuel-based transport frequently. Travel currently contributes ${percentage}% of your total footprint.`,
        nextBestAction: "Use public transport twice this week.",
        estimatedImpact: "This could help you save approximately 3–5 kg CO₂e this week.",
        sevenDayPlan: [
          { day: 1, action: "Track all travel activity" },
          { day: 2, action: "Replace one short trip with walking" },
          { day: 3, action: "Use public transport once" },
          { day: 4, action: "Combine errands into one trip" },
          { day: 5, action: "Avoid vehicle idling" },
          { day: 6, action: "Try carpooling or shared transport" },
          { day: 7, action: "Review your EcoScore" }
        ]
      };
      break;
    case "electricity":
      insight = {
        topCategory: "electricity",
        mainInsight: "Electricity usage is driving your footprint.",
        whyItMatters: `High energy consumption at home makes up ${percentage}% of your total footprint.`,
        nextBestAction: "Reduce AC usage by 1 hour daily and switch off unused appliances.",
        estimatedImpact: "This could help you save approximately 4–6 kg CO₂e this week.",
        sevenDayPlan: [
          { day: 1, action: "Identify phantom power drains (chargers, standby gadgets)" },
          { day: 2, action: "Use natural light until sunset" },
          { day: 3, action: "Adjust thermostat/AC by 1 degree" },
          { day: 4, action: "Run washing machine on cold, full load" },
          { day: 5, action: "Unplug 3 unused devices" },
          { day: 6, action: "Reduce screen time by 30 mins" },
          { day: 7, action: "Monitor your electricity meter or app" }
        ]
      };
      break;
    case "food":
      insight = {
        topCategory: "food",
        mainInsight: "Food and diet are your largest emission source.",
        whyItMatters: `Meat-heavy or packaged meals contribute ${percentage}% of your footprint.`,
        nextBestAction: "Try two plant-based meals this week.",
        estimatedImpact: "This could help you save approximately 2–4 kg CO₂e this week.",
        sevenDayPlan: [
          { day: 1, action: "Plan a meatless Monday/dinner" },
          { day: 2, action: "Avoid food delivery packaging" },
          { day: 3, action: "Eat leftovers to reduce waste" },
          { day: 4, action: "Choose local produce for a meal" },
          { day: 5, action: "Try a vegan recipe" },
          { day: 6, action: "Batch cook to save cooking energy" },
          { day: 7, action: "Compost any food scraps" }
        ]
      };
      break;
    case "shopping":
      insight = {
        topCategory: "shopping",
        mainInsight: "Shopping habits are increasing your footprint.",
        whyItMatters: `New purchases, especially electronics or fast fashion, make up ${percentage}% of your footprint.`,
        nextBestAction: "Avoid one non-essential purchase this week.",
        estimatedImpact: "This could help you save ~5+ kg CO₂e depending on the item.",
        sevenDayPlan: [
          { day: 1, action: "Unsubscribe from promotional emails" },
          { day: 2, action: "Implement a 24-hour rule before buying" },
          { day: 3, action: "Repair one broken item" },
          { day: 4, action: "Research second-hand options for needed items" },
          { day: 5, action: "Avoid single-use plastics today" },
          { day: 6, action: "Organize your closet/space" },
          { day: 7, action: "Donate items you no longer use" }
        ]
      };
      break;
    case "waste":
    default:
      insight = {
        topCategory: "waste",
        mainInsight: "General waste is your top emission category.",
        whyItMatters: `Unsorted waste accounts for ${percentage}% of your footprint.`,
        nextBestAction: "Recycle or compost for three days.",
        estimatedImpact: "This could help you save 1–2 kg CO₂e and reduce landfill use.",
        sevenDayPlan: [
          { day: 1, action: "Set up a recycling bin" },
          { day: 2, action: "Sort your plastics and paper" },
          { day: 3, action: "Start a food scrap container" },
          { day: 4, action: "Use reusable shopping bags" },
          { day: 5, action: "Refuse single-use cutlery/straws" },
          { day: 6, action: "Rinse recyclables properly" },
          { day: 7, action: "Drop off special recycling (e.g., batteries)" }
        ]
      };
      break;
  }

  return insight;
}

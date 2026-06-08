import { CarbonSummary, UserProfile, ActivityLog, Challenge } from "../types";

/**
 * EcoScore is a gamified rating (0-100) that evaluates a user's environmental impact.
 * The logic is deterministic:
 * 1. Base Score is 100 (or 80 if no data logged yet).
 * 2. Deductions occur for heavy footprints (e.g. weekly > 30kg or 50kg) and 
 *    poor profile habits (e.g. constant car usage or no recycling).
 * 3. Additions (+2 pts) occur when users complete weekly challenges, 
 *    and for high tracking consistency (+5 to +10 pts for logging over multiple unique days).
 */
export function calculateEcoScore(
  summary: CarbonSummary,
  profile: UserProfile | null,
  logs: ActivityLog[],
  completedChallengesCount: number
): number {
  let score = summary.total === 0 ? 80 : 100;

  // Only apply footprint penalties if there's actual data
  if (summary.total > 0) {
    const { byCategory, weeklyTotal } = summary;

    // Penalize high weekly footprints
    // Assuming a "good" weekly footprint is ~25kg
    if (weeklyTotal > 50) {
      score -= 10;
    } else if (weeklyTotal > 30) {
      score -= 5;
    }

    const categoryTotal = Object.values(byCategory).reduce((a, b) => a + b, 0);

    if (categoryTotal > 0) {
      const travelPct = byCategory.travel / categoryTotal;
      const electPct = byCategory.electricity / categoryTotal;

      if (travelPct > 0.4) score -= 10;
      if (electPct > 0.35) score -= 5;
    }
  }

  // Profile-based deductions
  if (profile) {
    if (profile.dietType === "High Meat" || profile.dietType === "mixed") {
      score -= 5; // simplified
    }
    if (profile.shoppingFrequency === "High") {
      score -= 5;
    }
    if (profile.recyclingHabit === "Never") {
      score -= 5;
    }
  }

  // Add points for positive behavior
  // Add 2 points per completed challenge
  score += completedChallengesCount * 2;

  // Add points for logging regularly
  const uniqueDaysLogged = new Set(logs.map(l => l.date)).size;
  if (uniqueDaysLogged > 2) {
    score += 5;
  }
  if (uniqueDaysLogged > 5) {
    score += 5; // more bonus
  }

  // Ensure bounds
  if (score > 100) score = 100;
  if (score < 0) score = 0;

  return Math.round(score);
}

export function getEcoScoreLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Needs Attention";
  return "High Impact";
}

import { CarbonSummary, UserProfile, ActivityLog, Challenge } from "../types";

export function calculateEcoScore(
  summary: CarbonSummary,
  profile: UserProfile | null,
  logs: ActivityLog[],
  completedChallengesCount: number
): number {
  let score = 100;

  // Nothing logged yet? Let's start neutral/good
  if (summary.total === 0) return 80;

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

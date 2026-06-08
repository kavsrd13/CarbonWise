import { WEEKLY_CHALLENGES } from "../data/challenges";
import { Challenge, Category } from "../types";

export function getPersonalizedChallenges(topCategory: Category | null): Challenge[] {
  if (!topCategory) return WEEKLY_CHALLENGES;
  return [...WEEKLY_CHALLENGES].sort((a, b) => {
    if (a.category === topCategory && b.category !== topCategory) return -1;
    if (b.category === topCategory && a.category !== topCategory) return 1;
    return 0;
  });
}

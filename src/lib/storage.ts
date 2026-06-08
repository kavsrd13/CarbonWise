import { UserProfile, ActivityLog, Challenge } from "../types";

const KEYS = {
  PROFILE: "carbonwise_profile",
  LOGS: "carbonwise_logs",
  CHALLENGES: "carbonwise_challenges",
  ONBOARDING: "carbonwise_onboarding_done",
};

export function getUserProfile(): UserProfile | null {
  try {
    const data = localStorage.getItem(KEYS.PROFILE);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
    localStorage.setItem(KEYS.ONBOARDING, "true");
  } catch (e) {
    // console.error(e)
  }
}

export function isOnboardingCompleted(): boolean {
  return localStorage.getItem(KEYS.ONBOARDING) === "true";
}

export function getActivityLogs(): ActivityLog[] {
  try {
    const data = localStorage.getItem(KEYS.LOGS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export function saveActivityLog(log: ActivityLog): void {
  try {
    const logs = getActivityLogs();
    logs.push(log);
    // Sort descending by date
    logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    localStorage.setItem(KEYS.LOGS, JSON.stringify(logs));
  } catch (e) {
  }
}

export function getChallengesState(): { active: string[], completed: string[] } {
  try {
    const data = localStorage.getItem(KEYS.CHALLENGES);
    return data ? JSON.parse(data) : { active: [], completed: [] };
  } catch (e) {
    return { active: [], completed: [] };
  }
}

export function updateChallengeStatus(id: string, status: "active" | "completed"): void {
  try {
    const state = getChallengesState();
    if (status === "active") {
      if (!state.active.includes(id)) state.active.push(id);
      state.completed = state.completed.filter(c => c !== id);
    } else if (status === "completed") {
      if (!state.completed.includes(id)) state.completed.push(id);
      state.active = state.active.filter(a => a !== id);
    }
    localStorage.setItem(KEYS.CHALLENGES, JSON.stringify(state));
  } catch (e) {
  }
}

export function clearAllData(): void {
  localStorage.removeItem(KEYS.PROFILE);
  localStorage.removeItem(KEYS.LOGS);
  localStorage.removeItem(KEYS.CHALLENGES);
  localStorage.removeItem(KEYS.ONBOARDING);
}

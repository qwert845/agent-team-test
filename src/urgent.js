// Display-only helper (not part of contracts/rules-api.md): is the remaining time urgent?
export const URGENT_SECONDS = 5;
export const URGENT_COLOR = "#e5484d";

export function isUrgent(timeLeft, over = false) {
  return !over && timeLeft <= URGENT_SECONDS;
}

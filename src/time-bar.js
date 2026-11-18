// Display-only time bar values. Keep the starting duration out of the game state.
import { isUrgent, URGENT_COLOR } from "./urgent.js";

export const TIME_BAR_COLOR = "#8a8a90";

export function getTimeBar(timeLeft, startTime, over = false) {
  if (over) return { ratio: 0, color: TIME_BAR_COLOR };

  const ratio = Number.isFinite(timeLeft) && Number.isFinite(startTime) && startTime > 0
    ? Math.max(0, Math.min(1, timeLeft / startTime))
    : 0;
  const color = isUrgent(timeLeft) ? URGENT_COLOR : TIME_BAR_COLOR;
  return { ratio, color };
}

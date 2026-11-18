// Display-only helper for the remaining time in the HUD.
export function formatRemainingTime(timeLeft) {
  const seconds = typeof timeLeft === "number" && Number.isFinite(timeLeft) && timeLeft > 0
    ? Math.ceil(timeLeft)
    : 0;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = String(seconds % 60).padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
}

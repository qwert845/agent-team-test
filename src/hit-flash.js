// Display-only target flash after a hit. Uses state.sinceHit; no game state is added.
export const FLASH_SECONDS = 0.15;
export const TARGET_COLOR = "#8a8a90";
export const FLASH_COLOR = "#d0d0d6";

export function getTargetColor(sinceHit, over = false) {
  if (over) return TARGET_COLOR;
  const flashing = typeof sinceHit === "number" && Number.isFinite(sinceHit) && sinceHit >= 0 && sinceHit < FLASH_SECONDS;
  return flashing ? FLASH_COLOR : TARGET_COLOR;
}

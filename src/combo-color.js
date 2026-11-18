// Display-only color for the combo text. Gold while the bonus is active (combo >= 3).
export const COMBO_GOLD = "#f5a524";
export const COMBO_BONUS_AT = 3;

// Returns the color to set, or "" to restore the original color.
export function getComboColor(combo, over = false) {
  if (over) return "";
  return typeof combo === "number" && Number.isFinite(combo) && combo >= COMBO_BONUS_AT ? COMBO_GOLD : "";
}

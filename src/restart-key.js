// Display-only helper (not part of contracts/rules-api.md): does this key restart a finished game?
export function isRestartKey(key, over) {
  return over === true && (key === "r" || key === "R");
}

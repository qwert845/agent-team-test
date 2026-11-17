// Game rules. The shape is fixed by contracts/rules-api.md.

export const ROUND_SECONDS = 30;

export const COMBO_WINDOW = 1;
export const COMBO_BONUS_AT = 3;

// combo: quick hits in a row. sinceHit: seconds since the last hit (null before the first).
export function createGame(seconds) {
  const start = typeof seconds === "number" && Number.isFinite(seconds) && seconds > 0 ? seconds : ROUND_SECONDS;
  return { score: 0, timeLeft: start, over: false, combo: 0, sinceHit: null };
}

export function hit(state) {
  if (state.over) return state;
  const quick = state.sinceHit !== null && state.sinceHit <= COMBO_WINDOW;
  const combo = quick ? state.combo + 1 : 0;
  const points = combo >= COMBO_BONUS_AT ? 2 : 1;
  return { ...state, score: state.score + points, combo, sinceHit: 0 };
}

export function tick(state, seconds) {
  if (state.over) return state;
  const timeLeft = Math.max(0, state.timeLeft - seconds);
  const sinceHit = state.sinceHit === null ? null : state.sinceHit + seconds;
  const combo = sinceHit !== null && sinceHit > COMBO_WINDOW ? 0 : state.combo;
  return { ...state, timeLeft, over: timeLeft === 0, combo, sinceHit };
}

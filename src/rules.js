// Game rules. The shape is fixed by contracts/rules-api.md.

export const ROUND_SECONDS = 30;

export function createGame() {
  return { score: 0, timeLeft: ROUND_SECONDS, over: false };
}

export function hit(state) {
  if (state.over) return state;
  return { ...state, score: state.score + 1 };
}

export function tick(state, seconds) {
  if (state.over) return state;
  const timeLeft = Math.max(0, state.timeLeft - seconds);
  return { ...state, timeLeft, over: timeLeft === 0 };
}

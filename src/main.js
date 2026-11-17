// Screen code. Uses only the functions in contracts/rules-api.md.
import { createGame, hit, tick } from "./rules.js";

const field = document.getElementById("field");
const target = document.getElementById("target");
const hud = document.getElementById("hud");
const comboView = document.getElementById("combo");
let state = createGame();

function moveTarget() {
  target.style.left = `${Math.random() * (field.clientWidth - 64)}px`;
  target.style.top = `${Math.random() * (field.clientHeight - 64)}px`;
}

function draw() {
  hud.textContent = state.over
    ? `끝 · 점수 ${state.score}`
    : `점수 ${state.score}  ·  남은 시간 ${Math.ceil(state.timeLeft)}초`;
  if (comboView) comboView.textContent = `연속 ${state.combo}`;
}

target.addEventListener("click", () => {
  state = hit(state);
  moveTarget();
  draw();
});

let last = performance.now();
function frame(now) {
  state = tick(state, (now - last) / 1000);
  last = now;
  draw();
  if (!state.over) requestAnimationFrame(frame);
}

moveTarget();
draw();
requestAnimationFrame(frame);

// Screen code. Game rules come only from the functions in contracts/rules-api.md; display-only helpers live in other files under src/.
import { createGame, hit, tick } from "./rules.js";
import { isRestartVisible } from "./restart.js";
import { isUrgent, URGENT_COLOR } from "./urgent.js";
import { getTimeBar } from "./time-bar.js";
import { getTargetColor } from "./hit-flash.js";
import { formatRemainingTime } from "./time-format.js";

const field = document.getElementById("field");
const target = document.getElementById("target");
const hud = document.getElementById("hud");
const timeBar = document.getElementById("time-bar");
const timeBarFill = document.getElementById("time-bar-fill");
const best = document.getElementById("best");
const comboView = document.getElementById("combo");
const restart = document.getElementById("restart");
let state = createGame();
let startTime = state.timeLeft;
let bestScore = 0;

function moveTarget() {
  target.style.left = `${Math.random() * (field.clientWidth - 64)}px`;
  target.style.top = `${Math.random() * (field.clientHeight - 64)}px`;
}

function draw() {
  hud.textContent = state.over
    ? `끝 · 점수 ${state.score}`
    : `점수 ${state.score}  ·  남은 시간 ${formatRemainingTime(state.timeLeft)}`;
  best.textContent = `최고 점수 ${bestScore}`;
  if (comboView) comboView.textContent = `연속 ${state.combo}`;
  restart.hidden = !isRestartVisible(state.over);
  hud.style.color = isUrgent(state.timeLeft, state.over) ? URGENT_COLOR : "";
  target.style.backgroundColor = getTargetColor(state.sinceHit, state.over);
  const bar = getTimeBar(state.timeLeft, startTime, state.over);
  timeBarFill.style.width = `${bar.ratio * 100}%`;
  timeBarFill.style.backgroundColor = bar.color;
  timeBar.setAttribute("aria-valuenow", String(Math.round(bar.ratio * 100)));
}

target.addEventListener("click", () => {
  state = hit(state);
  moveTarget();
  draw();
});

let last = performance.now();
function frame(now) {
  state = tick(state, (now - last) / 1000);
  if (state.over && state.score > bestScore) bestScore = state.score;
  last = now;
  draw();
  if (!state.over) requestAnimationFrame(frame);
}

restart.addEventListener("click", () => {
  state = createGame();
  startTime = state.timeLeft;
  last = performance.now();
  moveTarget();
  draw();
  requestAnimationFrame(frame);
});

moveTarget();
draw();
requestAnimationFrame(frame);

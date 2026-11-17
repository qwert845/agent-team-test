# 계약: 규칙 함수 모양 (`src/rules.js`)

화면 코드는 아래 함수만 쓴다. 규칙 코드는 이 모양을 지킨다.

| 함수 | 받는 것 | 돌려주는 것 |
|---|---|---|
| `createGame()` | 없음 | 새 상태 `{ score, timeLeft, over, combo, sinceHit }` (`score` 0, `timeLeft` 30, `over` false, `combo` 0, `sinceHit` null) |
| `hit(state)` | 상태 | 새 상태. 끝나지 않았으면 `score` + 1 (맞히기 전 1초 이내 연속이 3 이상이면 + 2), `combo`·`sinceHit` 갱신 |
| `tick(state, seconds)` | 상태, 지난 초 | 새 상태. `timeLeft`가 줄고, 0이 되면 `over` true (0 아래로 안 내려감), `sinceHit`이 늘고 1초가 넘으면 `combo` 0 |

- 함수는 받은 상태를 바꾸지 않고 새 상태를 돌려준다.
- `combo`: 1초 안에 이어 맞힌 횟수. `sinceHit`: 마지막으로 맞힌 뒤 지난 초(아직 안 맞혔으면 null).
- 이 표에 없는 칸을 상태에 더할 때는 계약 변경으로 한다.

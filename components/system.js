let testButtonOn = false;
let timeId = null;

let currentDifficulty = 0;
let score = 0;

let levelText = document.getElementById("level");
let scoreText = document.getElementById("score");
let gameOverText = document.getElementById("game-over");

let isGameOver = false;

// function onClickTestButton() {
//   if (testButtonOn) {
//     clearInterval(timeId);
//   } else {
//     timeId = setInterval(
//       () => gameScreen.flowGravity(),
//       timePerLine * Math.pow(increaseSpeedPerDifficulty, currentDifficulty)
//     );
//   }
//   testButtonOn = !testButtonOn;
// }

timeId = setInterval(
  () => gameScreen.flowGravity(),
  timePerLine * Math.pow(increaseSpeedPerDifficulty, currentDifficulty)
);

function levelUp() {
  currentDifficulty++;
  levelText.textContent = `${currentDifficulty}`;
  clearInterval(timeId);
  timeId = setInterval(
    () => gameScreen.flowGravity(),
    timePerLine * Math.pow(increaseSpeedPerDifficulty, currentDifficulty)
  );
}
function addScore(removedLineCount) {
  if (removedLineCount > 0) {
    score += removedLineCount * removedLineCount;
    scoreText.textContent = `${score}`;
  }
}

function gameOver() {
  isGameOver = true;
  clearInterval(timeId);
  gameOverText.style.visibility = "visible";
}

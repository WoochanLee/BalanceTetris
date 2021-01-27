let testButtonOn = false;
let timeId = null;

function onClickTestButton() {
  if (testButtonOn) {
    clearInterval(timeId);
  } else {
    timeId = setInterval(() => gameScreen.flowGravity(), timePerLine);
  }
  testButtonOn = !testButtonOn;
}

let testButtonOn = false;
let timeId = null;

function onClickTestButton() {
  if (testButtonOn) {
    clearInterval(timeId);
  } else {
    timeId = setInterval(flowGravity, timePerLine);
  }
  testButtonOn = !testButtonOn;
}

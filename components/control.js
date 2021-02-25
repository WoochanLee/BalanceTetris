window.onkeydown = (e) => {
  handleKeyboardEvent(e);
};

function handleKeyboardEvent(e) {
  if (isGameOver) {
    return;
  }

  switch (e.code) {
    case "ArrowLeft":
      gameScreen.onEventLeftArrow();
      break;

    case "ArrowRight":
      gameScreen.onEventRightArrow();
      break;

    case "ArrowDown":
      gameScreen.onEventDownArrow();
      break;

    case "ArrowUp":
      gameScreen.onEventUpArrow();
      break;

    case "Space":
      gameScreen.onEventSpace();
      break;

    case "ShiftLeft":
      gameScreen.onEventShift();
      break;
  }
  gameScreen.reDraw();
}

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

    case "KeyQ":
      gameScreen.onEventKeyQ();
      break;

    case "KeyE":
      gameScreen.onEventKeyE();
      break;

    case "KeyZ":
      gameScreen.onEventKeyZ();
      break;

    case "KeyC":
      gameScreen.onEventKeyC();
      break;
  }
  gameScreen.drawBlocks();
}

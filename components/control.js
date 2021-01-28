window.onkeydown = (e) => {
  handleKeyboardEvent(e);
};

function handleKeyboardEvent(e) {
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
  }
  gameScreen.reDraw();
}

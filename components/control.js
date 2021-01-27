window.onkeydown = (e) => {
  handleKeyboardEvent(e);
};

function handleKeyboardEvent(e) {
  switch (e.key) {
    case "ArrowLeft":
      onClickLeftArrow(
        gameScreen.controlBlock.blockArray,
        gameScreen.stackedBlock.blockArray
      );
      break;
    case "ArrowRight":
      onClickRightArrow(
        gameScreen.controlBlock.blockArray,
        gameScreen.stackedBlock.blockArray
      );
      break;
    case "ArrowDown":
      onClickDownArrow(
        gameScreen.controlBlock.blockArray,
        gameScreen.stackedBlock.blockArray
      );
      break;
  }
  gameScreen.reDraw();
}

function onClickLeftArrow(controlBlocks, stackedBlocks) {
  if (couldBlockMoveToLeft(controlBlocks, stackedBlocks)) {
    moveToLeftOneLine(controlBlocks);
  }
}

function onClickRightArrow(controlBlocks, stackedBlocks) {
  if (couldBlockMoveToRight(controlBlocks, stackedBlocks)) {
    moveToRightOneLine(controlBlocks);
  }
}

function onClickDownArrow(controlBlocks, stackedBlocks) {
  if (couldBlockMoveToBottom(controlBlocks, stackedBlocks)) {
    moveToBottomOneLine(controlBlocks);
  }
}

window.onkeydown = (e) => {
  console.log(e);
  handleKeyboardEvent(e);
};

function handleKeyboardEvent(e) {
  switch (e.key) {
    case "ArrowLeft":
      onClickLeftArrow(controlBlocks, stackedBlocks);
      break;
    case "ArrowRight":
      onClickRightArrow(controlBlocks, stackedBlocks);
      break;
    case "ArrowDown":
      onClickDownArrow(controlBlocks, stackedBlocks);
      break;
  }
  reDraw();
}

function clearBlockArray(blockArray) {
  for (let x = 0; x < widthBlockCount; x++) {
    for (let y = 0; y < heightBlockCount; y++) {
      blockArray[x][y] = false;
    }
  }
}

function drawBlocks() {
  for (let x = 0; x < widthBlockCount; x++) {
    for (let y = 0; y < heightBlockCount; y++) {
      if (stackedBlocks[x][y]) {
        ctx.fillStyle = "black";
      } else {
        ctx.fillStyle = "gray";
      }

      if (controlBlocks[x][y]) {
        ctx.fillStyle = "blue";
      }

      ctx.fillRect(
        borderWidth * x + blockSize * x,
        borderWidth * y + blockSize * y + topMargin,
        blockSize,
        blockSize
      );
    }
  }
}

function copyBlockArray(blockArray) {
  let tmpArray = new Array(widthBlockCount);
  for (let x = 0; x < widthBlockCount; x++) {
    tmpArray[x] = blockArray[x].slice();
  }
  return tmpArray;
}

function addBlocksToStackedArray(controlBlocks, stackedBlocks) {
  for (let x = 0; x < widthBlockCount; x++) {
    for (let y = 0; y < heightBlockCount; y++) {
      if (controlBlocks[x][y]) {
        stackedBlocks[x][y] = true;
      }
    }
  }
}

function addNewControlBlock(controlBlocks) {
  clearBlockArray(controlBlocks);
  let type = Math.floor(Math.random() * 6 + 1);

  switch (type) {
    case 1:
      addTypeOneBlock(controlBlocks);
      break;
    case 2:
      addTypeTwoBlock(controlBlocks);
      break;
    case 3:
      addTypeThreeBlock(controlBlocks);
      break;
    case 4:
      addTypeFourBlock(controlBlocks);
      break;
    case 5:
      addTypeFiveBlock(controlBlocks);
      break;
    case 6:
      addTypeSixBlock(controlBlocks);
      break;
  }
}

function flowGravity() {
  let collisionCheckTmpArray = copyBlockArray(controlBlocks);
  if (couldBlockMoveToBottom(collisionCheckTmpArray, stackedBlocks)) {
    moveToBottomOneLine(controlBlocks);
  } else {
    addBlocksToStackedArray(controlBlocks, stackedBlocks);
    addNewControlBlock(controlBlocks);
  }

  reDraw();
}

function reDraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBlocks();
}

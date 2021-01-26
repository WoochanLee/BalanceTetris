function moveToBottomOneLine(blockArray) {
  for (let x = 0; x < widthBlockCount; x++) {
    for (let y = heightBlockCount - 1; y != 0; y--) {
      blockArray[x][y] = blockArray[x][y - 1];
    }
    blockArray[x][0] = false;
  }
}

function moveToLeftOneLine(blockArray) {
  for (let y = 0; y < heightBlockCount; y++) {
    for (let x = 0; x < widthBlockCount - 1; x++) {
      blockArray[x][y] = blockArray[x + 1][y];
    }
    blockArray[widthBlockCount - 1][y] = false;
  }
}

function moveToRightOneLine(blockArray) {
  for (let y = 0; y < heightBlockCount; y++) {
    for (let x = widthBlockCount - 1; x != 0; x--) {
      blockArray[x][y] = blockArray[x - 1][y];
    }
    blockArray[0][y] = false;
  }
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

function couldBlockMoveToBottom(controlBlocks, stackedBlocks) {
  let collisionCheckTmpArray = copyBlockArray(controlBlocks);

  let isBlockReachToBottomSide = isBlockReachToBottomBorder(controlBlocks);
  let isBottomCollided = isBottomSideCollided(
    collisionCheckTmpArray,
    stackedBlocks
  );

  if (isBlockReachToBottomSide || isBottomCollided) {
    return false;
  }

  return true;
}

function couldBlockMoveToLeft(controlBlocks, stackedBlocks) {
  let collisionCheckTmpArray = copyBlockArray(controlBlocks);

  let isBlockReachToLeftSide = isBlockReachToLeftBorder(controlBlocks);
  let isLeftCollided = isLeftSideCollided(
    collisionCheckTmpArray,
    stackedBlocks
  );

  if (isBlockReachToLeftSide || isLeftCollided) {
    return false;
  }

  return true;
}

function couldBlockMoveToRight(controlBlocks, stackedBlocks) {
  let collisionCheckTmpArray = copyBlockArray(controlBlocks);

  let isBlockReachToRightSide = isBlockReachToRightBorder(controlBlocks);
  let isRightCollided = isRightSideCollided(
    collisionCheckTmpArray,
    stackedBlocks
  );

  if (isBlockReachToRightSide || isRightCollided) {
    return false;
  }

  return true;
}

function isBottomSideCollided(collisionCheckTmpArray, stackedBlocks) {
  moveToBottomOneLine(collisionCheckTmpArray);

  for (let x = 0; x < widthBlockCount; x++) {
    for (let y = 0; y < heightBlockCount; y++) {
      if (collisionCheckTmpArray[x][y] && stackedBlocks[x][y]) {
        return true;
      }
    }
  }

  return false;
}

function isLeftSideCollided(collisionCheckTmpArray, stackedBlocks) {
  moveToLeftOneLine(collisionCheckTmpArray);

  for (let x = 0; x < widthBlockCount; x++) {
    for (let y = 0; y < heightBlockCount; y++) {
      if (collisionCheckTmpArray[x][y] && stackedBlocks[x][y]) {
        return true;
      }
    }
  }

  return false;
}

function isRightSideCollided(collisionCheckTmpArray, stackedBlocks) {
  moveToRightOneLine(collisionCheckTmpArray);

  for (let x = 0; x < widthBlockCount; x++) {
    for (let y = 0; y < heightBlockCount; y++) {
      if (collisionCheckTmpArray[x][y] && stackedBlocks[x][y]) {
        return true;
      }
    }
  }

  return false;
}

function isBlockReachToBottomBorder(blockArray) {
  for (let x = 0; x < widthBlockCount; x++) {
    if (blockArray[x][heightBlockCount - 1]) {
      return true;
    }
  }
  return false;
}

function isBlockReachToLeftBorder(controlBlocks) {
  for (let y = 0; y < heightBlockCount; y++) {
    if (controlBlocks[0][y]) {
      return true;
    }
  }

  return false;
}

function isBlockReachToRightBorder(controlBlocks) {
  for (let y = 0; y < heightBlockCount; y++) {
    if (controlBlocks[widthBlockCount - 1][y]) {
      return true;
    }
  }
  return false;
}

/**
 ****□□□□****
 **/
function addTypeOneBlock(controlBlocks) {
  controlBlocks[4][0] = true;
  controlBlocks[5][0] = true;
  controlBlocks[6][0] = true;
  controlBlocks[7][0] = true;
}

/**
 ****□□□*****
 *****□******
 **/
function addTypeTwoBlock(controlBlocks) {
  controlBlocks[4][0] = true;
  controlBlocks[5][0] = true;
  controlBlocks[5][1] = true;
  controlBlocks[6][0] = true;
}

/**
 *****□□*****
 *****□□*****
 **/
function addTypeThreeBlock(controlBlocks) {
  controlBlocks[4][0] = true;
  controlBlocks[4][1] = true;
  controlBlocks[5][0] = true;
  controlBlocks[5][1] = true;
}

/**
 ****□□******
 *****□□*****
 **/
function addTypeFourBlock(controlBlocks) {
  controlBlocks[4][0] = true;
  controlBlocks[5][0] = true;
  controlBlocks[5][1] = true;
  controlBlocks[6][1] = true;
}

/**
 *****□□*****
 ****□□******
 **/
function addTypeFourBlock(controlBlocks) {
  controlBlocks[4][1] = true;
  controlBlocks[5][0] = true;
  controlBlocks[5][1] = true;
  controlBlocks[6][0] = true;
}

/**
 ****□□□****
 ******□****
 **/
function addTypeFiveBlock(controlBlocks) {
  controlBlocks[4][0] = true;
  controlBlocks[5][0] = true;
  controlBlocks[6][0] = true;
  controlBlocks[6][1] = true;
}

/**
 ****□□□****
 ****□*******
 **/
function addTypeSixBlock(controlBlocks) {
  controlBlocks[4][0] = true;
  controlBlocks[4][1] = true;
  controlBlocks[5][0] = true;
  controlBlocks[6][0] = true;
}

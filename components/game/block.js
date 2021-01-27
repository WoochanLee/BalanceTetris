function initBlockArray(blockArray) {
  for (let x = 0; x < widthBlockCount; x++) {
    blockArray[x] = new Array(heightBlockCount);
  }

  clearBlockArray(blockArray);
}

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

function couldBlockMoveToBottom(controlBlocks, stackedBlocks) {
  let collisionCheckTmpArray = copyBlockArray(controlBlocks);

  let isBlockReachToBottomSide = isBlockReachedToBottomBorder(controlBlocks);
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

  let isBlockReachToLeftSide = isBlockReachedToLeftBorder(controlBlocks);
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

  let isBlockReachToRightSide = isBlockReachedToRightBorder(controlBlocks);
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

function isBlockReachedToBottomBorder(blockArray) {
  for (let x = 0; x < widthBlockCount; x++) {
    if (blockArray[x][heightBlockCount - 1]) {
      return true;
    }
  }
  return false;
}

function isBlockReachedToLeftBorder(blockArray) {
  for (let y = 0; y < heightBlockCount; y++) {
    if (blockArray[0][y]) {
      return true;
    }
  }

  return false;
}

function isBlockReachedToRightBorder(blockArray) {
  for (let y = 0; y < heightBlockCount; y++) {
    if (blockArray[widthBlockCount - 1][y]) {
      return true;
    }
  }
  return false;
}

function clearBlockArray(blockArray) {
  for (let x = 0; x < widthBlockCount; x++) {
    for (let y = 0; y < heightBlockCount; y++) {
      blockArray[x][y] = false;
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

class ControlBlock {
  constructor() {
    this.makeRandomType();
    this.blockArray = new Array(widthBlockCount);
    initBlockArray(this.blockArray);
  }

  makeRandomType() {
    this.type = Math.floor(Math.random() * 6 + 1);
  }

  addNewControlBlock() {
    clearBlockArray(this.blockArray);

    switch (this.type) {
      case 1:
        this.addTypeOneBlock(this.blockArray);
        break;
      case 2:
        this.addTypeTwoBlock(this.blockArray);
        break;
      case 3:
        this.addTypeThreeBlock(this.blockArray);
        break;
      case 4:
        this.addTypeFourBlock(this.blockArray);
        break;
      case 5:
        this.addTypeFiveBlock(this.blockArray);
        break;
      case 6:
        this.addTypeSixBlock(this.blockArray);
        break;
    }
  }

  /**
   ****□□□□****
   **/
  addTypeOneBlock(blockArray) {
    blockArray[4][0] = true;
    blockArray[5][0] = true;
    blockArray[6][0] = true;
    blockArray[7][0] = true;
  }

  /**
   ****□□□*****
   *****□******
   **/
  addTypeTwoBlock(blockArray) {
    blockArray[4][0] = true;
    blockArray[5][0] = true;
    blockArray[5][1] = true;
    blockArray[6][0] = true;
  }

  /**
   *****□□*****
   *****□□*****
   **/
  addTypeThreeBlock(blockArray) {
    blockArray[4][0] = true;
    blockArray[4][1] = true;
    blockArray[5][0] = true;
    blockArray[5][1] = true;
  }

  /**
   ****□□******
   *****□□*****
   **/
  addTypeFourBlock(blockArray) {
    blockArray[4][0] = true;
    blockArray[5][0] = true;
    blockArray[5][1] = true;
    blockArray[6][1] = true;
  }

  /**
   *****□□*****
   ****□□******
   **/
  addTypeFourBlock(blockArray) {
    blockArray[4][1] = true;
    blockArray[5][0] = true;
    blockArray[5][1] = true;
    blockArray[6][0] = true;
  }

  /**
   ****□□□****
   ******□****
   **/
  addTypeFiveBlock(blockArray) {
    blockArray[4][0] = true;
    blockArray[5][0] = true;
    blockArray[6][0] = true;
    blockArray[6][1] = true;
  }

  /**
   ****□□□****
   ****□*******
   **/
  addTypeSixBlock(blockArray) {
    blockArray[4][0] = true;
    blockArray[4][1] = true;
    blockArray[5][0] = true;
    blockArray[6][0] = true;
  }
}

class StakedBlock {
  constructor() {
    this.blockArray = new Array(widthBlockCount);
    initBlockArray(this.blockArray);
  }
}

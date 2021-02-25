function findBlockRefPoint(blockArray) {
  let refPoint = null;
  for (let x = 0; x < widthBlockCount; x++) {
    for (let y = 0; y < heightBlockCount; y++) {
      if (blockArray[x][y].isExist) {
        refPoint = {
          x: x,
          y: y,
        };
        break;
      }
    }
    if (refPoint != null) break;
  }
  return refPoint;
}

function getLotatedBlock(
  rotationBlueprint,
  currentRotateDirection,
  controlBlock,
  controlBlockArray
) {
  let tmpArray = copyBlockArray(controlBlockArray);
  let refPoint = findBlockRefPoint(tmpArray);
  clearBlockArray(tmpArray);

  if (rotationBlueprint.length == 0) {
    return null;
  }

  let r = rotationBlueprint[currentRotateDirection];
  for (let i = 0; i < r.length; i++) {
    let rotatedX = refPoint.x + r[i][0];
    let rotatedY = refPoint.y + r[i][1];

    if (
      rotatedX >= 0 &&
      rotatedX < widthBlockCount &&
      rotatedY >= 0 &&
      rotatedY < heightBlockCount
    ) {
      tmpArray[rotatedX][rotatedY].isExist = true;
      tmpArray[rotatedX][rotatedY].blockColor =
        controlBlock.controlBlockType.blockType.blockColor;
    } else {
      return null;
    }
  }

  return tmpArray;
}

function getNextRotateDirection(currentRotateDirection, rotationAmount) {
  let nextRotationDirection = currentRotateDirection + 1;
  if (nextRotationDirection < rotationAmount) {
    return nextRotationDirection;
  } else {
    return 0;
  }
}

class ControlBlock {
  constructor() {
    this.currentRotateDirection = 0;
    this.initBlockTypes();
    this.initPreviewBlocks();
    this.blockArray = new Array(widthBlockCount);
    initBlockArray(this.blockArray);
  }

  initBlockTypes() {
    this.blockTypeOne = new BlockTypeOne();
    this.blockTypeTwo = new BlockTypeTwo();
    this.blockTypeThree = new BlockTypeThree();
    this.blockTypeFour = new BlockTypeFour();
    this.blockTypeFive = new BlockTypeFive();
    this.blockTypeSix = new BlockTypeSix();
    this.blockTypeSeven = new BlockTypeSeven();
  }

  initControlBlockType() {
    this.controlBlockType = new ControlBlockType(this.makeRandomType());
  }

  initPreviewBlocks() {
    this.previewBlockQueue = new Queue();
    for (let i = 0; i < previewBlockLocation.length; i++) {
      this.previewBlockQueue.enqueue(
        new ControlBlockType(this.makeRandomType())
      );
    }
  }

  makeRandomType() {
    let randomNum = Math.floor(Math.random() * 7);

    switch (randomNum) {
      case 0:
        return this.blockTypeOne;
      case 1:
        return this.blockTypeTwo;
      case 2:
        return this.blockTypeThree;
      case 3:
        return this.blockTypeFour;
      case 4:
        return this.blockTypeFive;
      case 5:
        return this.blockTypeSix;
      case 6:
        return this.blockTypeSeven;
    }
  }

  changeContorlBlock(controlBlockType) {
    this.controlBlockType = controlBlockType;
    this.refreshBlockArray();
  }

  addNewControlBlock() {
    this.controlBlockType = this.previewBlockQueue.dequeue();
    this.previewBlockQueue.enqueue(new ControlBlockType(this.makeRandomType()));
    this.refreshBlockArray();
  }

  refreshBlockArray() {
    this.currentRotateDirection = 0;
    clearBlockArray(this.blockArray);

    let shape = this.controlBlockType.blockType.shape;
    for (let i = 0; i < shape.length; i++) {
      let block = this.blockArray[shape[i][0] + widthBlockPaddingCount][
        shape[i][1]
      ];
      block.isExist = true;
      block.blockColor = this.controlBlockType.blockType.blockColor;
    }
  }

  rotateBlock(
    controlBlock,
    controlBlockArray,
    stackedBlockArray,
    allowableRange
  ) {
    let rotatedBlockArray = getLotatedBlock(
      this.controlBlockType.blockType.rotationBlueprint,
      this.currentRotateDirection,
      controlBlock,
      controlBlockArray
    );

    if (rotatedBlockArray == null) {
      if (allowableRange > 0) {
        let couldLeftRotate = this.checkLeftMoveRotation(
          controlBlock,
          controlBlockArray,
          stackedBlockArray,
          allowableRange
        );

        if (couldLeftRotate) {
          return true;
        } else {
          return this.checkRightMoveRotation(
            controlBlock,
            controlBlockArray,
            stackedBlockArray,
            allowableRange
          );
        }
      } else {
        return false;
      }
    }

    if (!isOverlaped(rotatedBlockArray, stackedBlockArray)) {
      this.currentRotateDirection = getNextRotateDirection(
        this.currentRotateDirection,
        this.controlBlockType.blockType.rotationBlueprint.length
      );
      controlBlock.blockArray = rotatedBlockArray;
      return true;
    } else {
      return false;
    }
  }

  checkLeftMoveRotation(
    controlBlock,
    controlBlockArray,
    stackedBlockArray,
    allowableRange
  ) {
    let tmpArray = copyBlockArray(controlBlockArray);
    if (couldBlockMoveToLeft(tmpArray, stackedBlockArray)) {
      moveToLeftOneLine(tmpArray);

      return this.rotateBlock(
        controlBlock,
        tmpArray,
        stackedBlockArray,
        allowableRange - 1
      );
    }
  }

  checkRightMoveRotation(
    controlBlock,
    controlBlockArray,
    stackedBlockArray,
    allowableRange
  ) {
    let tmpArray = copyBlockArray(controlBlockArray);
    if (couldBlockMoveToRight(tmpArray, stackedBlockArray)) {
      moveToRightOneLine(tmpArray);

      return this.rotateBlock(
        controlBlock,
        tmpArray,
        stackedBlockArray,
        allowableRange - 1
      );
    }
  }

  removeControlBlock() {
    clearBlockArray(this.blockArray);
  }
}

class ControlBlockType {
  constructor(blockType) {
    this.blockType = blockType;
  }
}

class StakedBlock {
  constructor() {
    this.blockArray = new Array(widthBlockCount);
    initBlockArray(this.blockArray);
  }
}

function initBlockArray(blockArray) {
  for (let x = 0; x < widthBlockCount; x++) {
    blockArray[x] = new Array(heightBlockCount);
    for (let y = 0; y < heightBlockCount; y++) {
      blockArray[x][y] = {
        isExist: false,
      };
    }
  }

  clearBlockArray(blockArray);
}

function moveToBottomOneLine(blockArray) {
  for (let x = 0; x < widthBlockCount; x++) {
    for (let y = heightBlockCount - 1; y != 0; y--) {
      copySingleBlock(blockArray[x][y], blockArray[x][y - 1]);
    }
    blockArray[x][0].isExist = false;
  }
}

function moveToLeftOneLine(blockArray) {
  for (let y = 0; y < heightBlockCount; y++) {
    for (let x = 0; x < widthBlockCount - 1; x++) {
      copySingleBlock(blockArray[x][y], blockArray[x + 1][y]);
    }
    blockArray[widthBlockCount - 1][y].isExist = false;
  }
}

function moveToRightOneLine(blockArray) {
  for (let y = 0; y < heightBlockCount; y++) {
    for (let x = widthBlockCount - 1; x != 0; x--) {
      copySingleBlock(blockArray[x][y], blockArray[x - 1][y]);
    }
    blockArray[0][y].isExist = false;
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

function isBottomSideCollided(blockArray1, blockArray2) {
  moveToBottomOneLine(blockArray1);

  return isOverlaped(blockArray1, blockArray2);
}

function isLeftSideCollided(blockArray1, blockArray2) {
  moveToLeftOneLine(blockArray1);

  return isOverlaped(blockArray1, blockArray2);
}

function isRightSideCollided(blockArray1, blockArray2) {
  moveToRightOneLine(blockArray1);

  return isOverlaped(blockArray1, blockArray2);
}

function isOverlaped(blockArray1, blockArray2) {
  for (let x = 0; x < widthBlockCount; x++) {
    for (let y = 0; y < heightBlockCount; y++) {
      if (blockArray1[x][y].isExist && blockArray2[x][y].isExist) {
        return true;
      }
    }
  }

  return false;
}

function isBlockReachedToBottomBorder(blockArray) {
  for (let x = 0; x < widthBlockCount; x++) {
    if (blockArray[x][heightBlockCount - 1].isExist) {
      return true;
    }
  }
  return false;
}

function isBlockReachedToLeftBorder(blockArray) {
  for (let y = 0; y < heightBlockCount; y++) {
    if (blockArray[0][y].isExist) {
      return true;
    }
  }

  return false;
}

function isBlockReachedToRightBorder(blockArray) {
  for (let y = 0; y < heightBlockCount; y++) {
    if (blockArray[widthBlockCount - 1][y].isExist) {
      return true;
    }
  }
  return false;
}

function clearBlockArray(blockArray) {
  for (let x = 0; x < widthBlockCount; x++) {
    for (let y = 0; y < heightBlockCount; y++) {
      blockArray[x][y].isExist = false;
      blockArray[x][y].blockColor = null;
    }
  }
}

function copyBlockArray(blockArray) {
  let tmpArray = new Array(widthBlockCount);
  initBlockArray(tmpArray);
  for (let x = 0; x < widthBlockCount; x++) {
    for (let y = 0; y < heightBlockCount; y++) {
      copySingleBlock(tmpArray[x][y], blockArray[x][y]);
    }
  }
  return tmpArray;
}

function copySingleBlock(blockTo, blockFrom) {
  blockTo.isExist = blockFrom.isExist;
  blockTo.blockColor = blockFrom.blockColor;
}

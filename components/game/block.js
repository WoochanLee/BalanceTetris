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

function getRotatedBlock(
  rotationBlueprint,
  reverseRotationBlueprint,
  newRotateDirection,
  controlBlock,
  controlBlockArray,
  stackedBlockArray,
  isForwardRotation
) {
  let tmpArray = copyBlockArray(controlBlockArray);
  let refPoint = findBlockRefPoint(tmpArray);
  clearBlockArray(tmpArray);

  if (rotationBlueprint.length == 0) {
    return null;
  }

  let r;
  if (isForwardRotation) {
    r = rotationBlueprint[newRotateDirection];
  } else {
    r = reverseRotationBlueprint[newRotateDirection];
  }

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

  if (isOverlaped(tmpArray, stackedBlockArray)) {
    return null;
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

function getPrevRotateDirection(currentRotateDirection, rotationAmount) {
  let prevRotationDirection = currentRotateDirection - 1;
  if (prevRotationDirection < 0) {
    return rotationAmount - 1;
  } else {
    return prevRotationDirection;
  }
}

class ControlBlock {
  constructor() {
    this.currentRotateDirection = 0;
    this.initBlockTypes();
    this.initPreviewBlocks();
    this.blockArray = new Array(widthBlockCount);
    this.controlBlockCount = 0;
    initBlockArray(this.blockArray);
    this.initControlBlockType();
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
    this.addNewControlBlock();
  }

  initPreviewBlocks() {
    this.previewBlockQueue = new Queue();

    for (let i = 0; i < 2; i++) {
      this.enqueueRandomTypePack();
    }
  }

  enqueueRandomTypePack() {
    let array = this.makeRandomTypePack();

    for (let i = 0; i < array.length; i++) {
      this.previewBlockQueue.enqueue(new ControlBlockType(array[i]));
    }
  }

  makeRandomTypePack() {
    return shuffleArray([
      this.blockTypeOne,
      this.blockTypeTwo,
      this.blockTypeThree,
      this.blockTypeFour,
      this.blockTypeFive,
      this.blockTypeSix,
      this.blockTypeSeven,
    ]);
  }

  changeContorlBlock(controlBlockType) {
    this.controlBlockType = controlBlockType;
    this.refreshBlockArray();
  }

  addNewControlBlock() {
    this.controlBlockCount++;
    this.controlBlockType = this.previewBlockQueue.dequeue();
    if (this.controlBlockCount % 7 == 0) {
      this.enqueueRandomTypePack();
    }
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

  rotate(
    controlBlock,
    controlBlockArray,
    stackedBlockArray,
    allowableRange,
    isForwardRotation
  ) {
    let couldKickRotate = this.rotateBlock(
      controlBlock,
      controlBlockArray,
      stackedBlockArray,
      allowableRange,
      isForwardRotation,
      false
    );

    console.log(couldKickRotate);

    if (!couldKickRotate) {
      this.rotateBlock(
        controlBlock,
        controlBlockArray,
        stackedBlockArray,
        allowableRange,
        isForwardRotation,
        true
      );
    }
  }

  rotateBlock(
    controlBlock,
    controlBlockArray,
    stackedBlockArray,
    allowableRange,
    isForwardRotation,
    isSpin
  ) {
    let newRotateDirection;

    if (isForwardRotation) {
      newRotateDirection = getNextRotateDirection(
        this.currentRotateDirection,
        this.controlBlockType.blockType.rotationBlueprint.length
      );
    } else {
      newRotateDirection = getPrevRotateDirection(
        this.currentRotateDirection,
        this.controlBlockType.blockType.rotationBlueprint.length
      );
    }

    console.log("1");

    let rotatedBlockArray = getRotatedBlock(
      this.controlBlockType.blockType.rotationBlueprint,
      this.controlBlockType.blockType.reverseRotationBlueprint,
      newRotateDirection,
      controlBlock,
      controlBlockArray,
      stackedBlockArray,
      isForwardRotation
    );

    console.log("2");

    if (rotatedBlockArray == null) {
      console.log("3");
      if (allowableRange > 0) {
        let couldLeftMoveRotate;
        let couldRightMoveRotate;

        couldLeftMoveRotate = this.checkLeftMoveRotation(
          controlBlock,
          controlBlockArray,
          stackedBlockArray,
          allowableRange,
          isForwardRotation,
          isSpin
        );

        if (couldLeftMoveRotate) {
          console.log("4");
          return true;
        } else {
          couldRightMoveRotate = this.checkRightMoveRotation(
            controlBlock,
            controlBlockArray,
            stackedBlockArray,
            allowableRange,
            isForwardRotation,
            isSpin
          );
        }

        console.log("5");

        if (isSpin) {
          if (couldRightMoveRotate) {
            console.log("6");
            return true;
          } else {
            console.log("7");
            return this.checkBottomMoveRotation(
              controlBlock,
              controlBlockArray,
              stackedBlockArray,
              allowableRange,
              isForwardRotation,
              isSpin
            );
          }
        } else {
          console.log("8");
          return couldRightMoveRotate;
        }
      } else {
        console.log("9");
        return false;
      }
    }

    this.currentRotateDirection = newRotateDirection;
    controlBlock.blockArray = rotatedBlockArray;

    console.log("10");

    return true;

    // if (!isOverlaped(rotatedBlockArray, stackedBlockArray)) {
    //   this.currentRotateDirection = newRotateDirection;
    //   controlBlock.blockArray = rotatedBlockArray;
    //   return true;
    // } else {
    //   return false;
    // }
  }

  checkLeftMoveRotation(
    controlBlock,
    controlBlockArray,
    stackedBlockArray,
    allowableRange,
    isForwardRotation,
    isSpin
  ) {
    let tmpArray = copyBlockArray(controlBlockArray);
    if (!isBlockReachedToLeftBorder(tmpArray)) {
      moveToLeftOneLine(tmpArray);

      return this.rotateBlock(
        controlBlock,
        tmpArray,
        stackedBlockArray,
        allowableRange - 1,
        isForwardRotation,
        isSpin
      );
    } else {
      return false;
    }
  }

  checkRightMoveRotation(
    controlBlock,
    controlBlockArray,
    stackedBlockArray,
    allowableRange,
    isForwardRotation,
    isSpin
  ) {
    let tmpArray = copyBlockArray(controlBlockArray);
    if (!isBlockReachedToRightBorder(tmpArray)) {
      moveToRightOneLine(tmpArray);

      return this.rotateBlock(
        controlBlock,
        tmpArray,
        stackedBlockArray,
        allowableRange - 1,
        isForwardRotation,
        isSpin
      );
    } else {
      return false;
    }
  }

  checkBottomMoveRotation(
    controlBlock,
    controlBlockArray,
    stackedBlockArray,
    allowableRange,
    isForwardRotation,
    isSpin
  ) {
    let tmpArray = copyBlockArray(controlBlockArray);
    if (!isBlockReachedToBottomBorder(tmpArray)) {
      moveToBottomOneLine(tmpArray);

      return this.rotateBlock(
        controlBlock,
        tmpArray,
        stackedBlockArray,
        allowableRange - 1,
        isForwardRotation,
        isSpin
      );
    } else {
      return false;
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

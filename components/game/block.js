function findBlockRefPoint(blockArray) {
  let refPoint = null;
  for (let x = 0; x < widthBlockCount + outBorderBlockCount * 2; x++) {
    for (let y = 0; y < heightBlockCount + outBorderBlockCount; y++) {
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
      rotatedX < widthBlockCount + outBorderBlockCount * 2 &&
      rotatedY >= 0 &&
      rotatedY < heightBlockCount + outBorderBlockCount
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

function isInBorder(blockArray) {
  for (let x = 0; x < widthBlockCount + outBorderBlockCount * 2; x++) {
    for (let y = 0; y < heightBlockCount + outBorderBlockCount; y++) {
      if (
        blockArray[x][y].isExist == true &&
        !(
          x >= outBorderBlockCount &&
          x < widthBlockCount + outBorderBlockCount &&
          y >= 0 &&
          y < heightBlockCount
        )
      ) {
        return false;
      }
    }
  }

  return true;
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
    this.blockArray = new Array(widthBlockCount + outBorderBlockCount * 2);
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
      let block = this.blockArray[
        shape[i][0] + widthBlockPaddingCount + outBorderBlockCount
      ][shape[i][1]];
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
    let newRotateDirection;

    if (isForwardRotation) {
      newRotateDirection = getNextRotateDirection(
        this.currentRotateDirection,
        this.controlBlockType.blockType.rotationBlueprint.length
      );
    } else {
      newRotateDirection = getPrevRotateDirection(
        this.currentRotateDirection,
        this.controlBlockType.blockType.reverseRotationBlueprint.length
      );
    }

    let rotatedBlockArray = getRotatedBlock(
      this.controlBlockType.blockType.rotationBlueprint,
      this.controlBlockType.blockType.reverseRotationBlueprint,
      newRotateDirection,
      controlBlock,
      controlBlockArray,
      isForwardRotation
    );

    if (rotatedBlockArray == null) {
      return;
    }

    let couldKickRotate = this.rotateBlock(
      newRotateDirection,
      controlBlock,
      rotatedBlockArray,
      stackedBlockArray,
      allowableRange,
      isForwardRotation,
      false,
      0,
      0,
      0
    );

    if (!couldKickRotate) {
      this.rotateBlock(
        newRotateDirection,
        controlBlock,
        rotatedBlockArray,
        stackedBlockArray,
        allowableRange,
        isForwardRotation,
        true,
        0,
        0,
        0
      );
    }
  }

  rotateBlock(
    newRotateDirection,
    controlBlock,
    rotatedBlockArray,
    stackedBlockArray,
    allowableRange,
    isForwardRotation,
    isSpin,
    moveLeftCount,
    moveRightCount,
    moveBottomCount
  ) {
    if (
      !isInBorder(rotatedBlockArray) ||
      isOverlaped(rotatedBlockArray, stackedBlockArray)
    ) {
      if (allowableRange > 0) {
        let couldLeftMoveRotate;
        let couldRightMoveRotate;

        if (moveLeftCount >= allowableRotationRange - 1) {
          couldLeftMoveRotate = false;
        } else {
          couldLeftMoveRotate = this.checkLeftMoveRotation(
            newRotateDirection,
            controlBlock,
            rotatedBlockArray,
            stackedBlockArray,
            allowableRange,
            isForwardRotation,
            isSpin,
            moveLeftCount,
            moveRightCount,
            moveBottomCount
          );
        }

        if (couldLeftMoveRotate) {
          return true;
        } else {
          if (moveRightCount >= allowableRotationRange - 1) {
            couldRightMoveRotate = false;
          } else {
            couldRightMoveRotate = this.checkRightMoveRotation(
              newRotateDirection,
              controlBlock,
              rotatedBlockArray,
              stackedBlockArray,
              allowableRange,
              isForwardRotation,
              isSpin,
              moveLeftCount,
              moveRightCount,
              moveBottomCount
            );
          }
        }

        if (isSpin) {
          if (couldRightMoveRotate) {
            return true;
          } else {
            if (moveBottomCount >= allowableRotationRange - 1) {
              return false;
            } else {
              return this.checkBottomMoveRotation(
                newRotateDirection,
                controlBlock,
                rotatedBlockArray,
                stackedBlockArray,
                allowableRange,
                isForwardRotation,
                isSpin,
                moveLeftCount,
                moveRightCount,
                moveBottomCount
              );
            }
          }
        } else {
          return couldRightMoveRotate;
        }
      } else {
        return false;
      }
    }
    this.currentRotateDirection = newRotateDirection;
    controlBlock.blockArray = rotatedBlockArray;

    return true;
  }

  checkLeftMoveRotation(
    newRotateDirection,
    controlBlock,
    rotatedBlockArray,
    stackedBlockArray,
    allowableRange,
    isForwardRotation,
    isSpin,
    moveLeftCount,
    moveRightCount,
    moveBottomCount
  ) {
    let tmpArray = copyBlockArray(rotatedBlockArray);
    if (!isBlockReachedToLeftBorder(tmpArray)) {
      moveToLeftOneLine(tmpArray);

      return this.rotateBlock(
        newRotateDirection,
        controlBlock,
        tmpArray,
        stackedBlockArray,
        allowableRange - 1,
        isForwardRotation,
        isSpin,
        moveLeftCount + 1,
        moveRightCount,
        moveBottomCount
      );
    } else {
      return false;
    }
  }

  checkRightMoveRotation(
    newRotateDirection,
    controlBlock,
    rotatedBlockArray,
    stackedBlockArray,
    allowableRange,
    isForwardRotation,
    isSpin,
    moveLeftCount,
    moveRightCount,
    moveBottomCount
  ) {
    let tmpArray = copyBlockArray(rotatedBlockArray);
    if (!isBlockReachedToRightBorder(tmpArray)) {
      moveToRightOneLine(tmpArray);

      return this.rotateBlock(
        newRotateDirection,
        controlBlock,
        tmpArray,
        stackedBlockArray,
        allowableRange - 1,
        isForwardRotation,
        isSpin,
        moveLeftCount,
        moveRightCount + 1,
        moveBottomCount
      );
    } else {
      return false;
    }
  }

  checkBottomMoveRotation(
    newRotateDirection,
    controlBlock,
    rotatedBlockArray,
    stackedBlockArray,
    allowableRange,
    isForwardRotation,
    isSpin,
    moveLeftCount,
    moveRightCount,
    moveBottomCount
  ) {
    let tmpArray = copyBlockArray(rotatedBlockArray);
    if (!isBlockReachedToBottomBorder(tmpArray)) {
      moveToBottomOneLine(tmpArray);

      return this.rotateBlock(
        newRotateDirection,
        controlBlock,
        tmpArray,
        stackedBlockArray,
        allowableRange - 1,
        isForwardRotation,
        isSpin,
        moveLeftCount,
        moveRightCount,
        moveBottomCount + 1
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
    this.blockArray = new Array(widthBlockCount + outBorderBlockCount * 2);
    initBlockArray(this.blockArray);
  }
}

function initBlockArray(blockArray) {
  for (let x = 0; x < widthBlockCount + outBorderBlockCount * 2; x++) {
    blockArray[x] = new Array(heightBlockCount + outBorderBlockCount);
    for (let y = 0; y < heightBlockCount + outBorderBlockCount; y++) {
      blockArray[x][y] = {
        isExist: false,
        isPrevExisted: false,
      };
    }
  }

  clearBlockArray(blockArray);
}

function moveToBottomOneLine(blockArray) {
  for (let x = 0; x < widthBlockCount + outBorderBlockCount * 2; x++) {
    for (let y = heightBlockCount + outBorderBlockCount - 1; y != 0; y--) {
      copySingleBlockWithPrev(blockArray[x][y], blockArray[x][y - 1], blockArray[x][y].isExist); 
    }
    blockArray[x][0].isExist = false;
  }
}

function moveToLeftOneLine(blockArray) {
  for (let y = 0; y < heightBlockCount + outBorderBlockCount; y++) {
    for (let x = 0; x < widthBlockCount + outBorderBlockCount * 2 - 1; x++) {
      copySingleBlockWithPrev(blockArray[x][y], blockArray[x + 1][y], blockArray[x][y].isExist);
    }
    blockArray[widthBlockCount + outBorderBlockCount * 2 - 1][
      y
    ].isExist = false;
  }
}

function moveToRightOneLine(blockArray) {
  for (let y = 0; y < heightBlockCount + outBorderBlockCount; y++) {
    for (let x = widthBlockCount + outBorderBlockCount * 2 - 1; x != 0; x--) {
      copySingleBlockWithPrev(blockArray[x][y], blockArray[x - 1][y], blockArray[x][y].isExist);
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
  for (let x = 0; x < widthBlockCount + outBorderBlockCount * 2; x++) {
    for (let y = 0; y < heightBlockCount + outBorderBlockCount; y++) {
      if (blockArray1[x][y].isExist && blockArray2[x][y].isExist) {
        return true;
      }
    }
  }

  return false;
}

function isBlockReachedToBottomBorder(blockArray) {
  for (let x = 0; x < widthBlockCount + outBorderBlockCount * 2; x++) {
    if (blockArray[x][heightBlockCount - 1].isExist) {
      return true;
    }
  }
  return false;
}

function isBlockReachedToLeftBorder(blockArray) {
  for (let y = 0; y < heightBlockCount + outBorderBlockCount; y++) {
    if (blockArray[outBorderBlockCount][y].isExist) {
      return true;
    }
  }

  return false;
}

function isBlockReachedToRightBorder(blockArray) {
  for (let y = 0; y < heightBlockCount + outBorderBlockCount; y++) {
    if (blockArray[widthBlockCount + outBorderBlockCount - 1][y].isExist) {
      return true;
    }
  }
  return false;
}

function clearBlockArray(blockArray) {
  for (let x = 0; x < widthBlockCount + outBorderBlockCount * 2; x++) {
    for (let y = 0; y < heightBlockCount + outBorderBlockCount; y++) {
      if(blockArray[x][y].isExist)
        blockArray[x][y].isPrevExisted = true
      blockArray[x][y].isExist = false;
      blockArray[x][y].blockColor = null;
    }
  }
}

function copyBlockArray(blockArray) {
  let tmpArray = new Array(widthBlockCount + outBorderBlockCount * 2);
  initBlockArray(tmpArray);
  for (let x = 0; x < widthBlockCount + outBorderBlockCount * 2; x++) {
    for (let y = 0; y < heightBlockCount + outBorderBlockCount; y++) {
      copySingleBlock(tmpArray[x][y], blockArray[x][y]);
    }
  }
  return tmpArray;
}

function copySingleBlockWithPrev(blockTo, blockFrom, prev) {
  blockTo.isPrevExisted = prev
  copySingleBlock(blockTo, blockFrom)
}

function copySingleBlock(blockTo, blockFrom) {
  blockTo.isExist = blockFrom.isExist;
  blockTo.blockColor = blockFrom.blockColor;
}

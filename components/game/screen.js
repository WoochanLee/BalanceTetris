/**
 * canvas setting
 */
const topMargin = -20;
const leftMargin = 120;

/**
 * block UI setting
 */
const borderWidth = 0;
const blockSize = 25;
const widthBlockCount = 10;
const widthBlockPaddingCount = 3;
const heightBlockCount = 25;
const hideTopLine = 1;
const shadowWidth = 3;
const blockShadowOpacity = "cc";
const blockShadowOpacity2 = "55";

class GameScreen {
  constructor() {
    this.canvas = document.getElementById("canvas");

    this.ctx = canvas.getContext("2d");

    this.stackedBlock = new StakedBlock();
    this.controlBlock = new ControlBlock();
    this.shiftBlock = new ShiftBlock();
    this.previewBlockManager = new PreviewBlockManager();
    this.isSpaceDownRunning = false;
    this.init();
  }

  init() {
    this.flowGravity();
  }

  drawBlocks() {
    this.drawTetrisBlocks();
    this.drawNextBlocks();
    this.drawShiftBlock();
  }

  drawTetrisBlocks() {
    for (let x = 0; x < widthBlockCount; x++) {
      for (let y = hideTopLine; y < heightBlockCount; y++) {
        let blockColor;
        let stackedSingleBlock = this.stackedBlock.blockArray[x][y];
        if (stackedSingleBlock.isExist) {
          blockColor = stackedSingleBlock.blockColor;
        } else {
          blockColor = "#37393A";
        }

        let controlSingleBlock = this.controlBlock.blockArray[x][y];
        if (controlSingleBlock.isExist) {
          blockColor = controlSingleBlock.blockColor;
        }

        this.ctx.fillStyle = blockColor + blockShadowOpacity;

        this.ctx.fillRect(
          borderWidth * x + blockSize * x + leftMargin,
          borderWidth * y + blockSize * y + topMargin,
          blockSize,
          blockSize
        );

        //draw top left shadow
        this.ctx.fillStyle = blockColor + blockShadowOpacity2;
        this.ctx.fillRect(
          borderWidth * x + blockSize * x + leftMargin,
          borderWidth * y + blockSize * y + topMargin,
          blockSize,
          shadowWidth
        );

        this.ctx.fillRect(
          borderWidth * x + blockSize * x + leftMargin,
          borderWidth * y + blockSize * y + topMargin,
          shadowWidth,
          blockSize
        );

        //draw bottom right shadow
        if (controlSingleBlock.isExist || stackedSingleBlock.isExist) {
          this.ctx.fillStyle = blockColor;
          this.ctx.fillRect(
            borderWidth * x + blockSize * x + leftMargin,
            borderWidth * y +
              blockSize * y +
              topMargin +
              blockSize -
              shadowWidth,
            blockSize,
            shadowWidth
          );

          this.ctx.fillRect(
            borderWidth * x +
              blockSize * x +
              leftMargin +
              blockSize -
              shadowWidth,
            borderWidth * y + blockSize * y + topMargin,
            shadowWidth,
            blockSize
          );
        }
      }
    }
  }

  drawNextBlocks() {
    this.previewBlockManager.setBlockType(this.controlBlock.previewBlockQueue);
    this.previewBlockManager.draw(this.ctx);
  }

  drawShiftBlock() {
    this.shiftBlock.draw(this.ctx);
  }

  flowGravity() {
    let collisionCheckTmpArray = copyBlockArray(this.controlBlock.blockArray);
    if (
      couldBlockMoveToBottom(
        collisionCheckTmpArray,
        this.stackedBlock.blockArray
      )
    ) {
      moveToBottomOneLine(this.controlBlock.blockArray);
      rewindTimer();
    } else {
      this.shiftBlock.isAlreadyShiftedThisTime = false;
      this.isSpaceDownRunning = false;
      this.addBlocksToStackedArray(
        this.controlBlock.blockArray,
        this.stackedBlock.blockArray
      );
      let removedLineCount = this.removeCompletedLine(0);
      addScore(removedLineCount);

      if (this.checkIsGameOver(this.stackedBlock.blockArray)) {
        this.controlBlock.removeControlBlock();
        gameOver();
      } else {
        this.controlBlock.addNewControlBlock();
        levelUp();
        this.flowGravity();
        rewindTimer();
      }
    }

    this.reDraw();
  }

  removeCompletedLine(lineCount) {
    let stackedBlockArray = this.stackedBlock.blockArray;
    for (let y = 0; y < heightBlockCount; y++) {
      let isCompletedLine = true;
      for (let x = 0; x < widthBlockCount; x++) {
        if (!stackedBlockArray[x][y].isExist) {
          isCompletedLine = false;
          break;
        }
      }
      if (isCompletedLine) {
        this.removeLine(y);
        return this.removeCompletedLine(lineCount + 1);
      }
    }
    return lineCount;
  }

  removeLine(removeY) {
    let stackedBlockArray = this.stackedBlock.blockArray;
    for (let y = removeY; y > 0; y--) {
      for (let x = 0; x < widthBlockCount; x++) {
        copySingleBlock(stackedBlockArray[x][y], stackedBlockArray[x][y - 1]);
      }
    }
  }

  addBlocksToStackedArray(controlBlocks, stackedBlocks) {
    for (let x = 0; x < widthBlockCount; x++) {
      for (let y = 0; y < heightBlockCount; y++) {
        if (controlBlocks[x][y].isExist) {
          copySingleBlock(stackedBlocks[x][y], controlBlocks[x][y]);
        }
      }
    }
  }

  shiftControlBlock() {
    if (this.shiftBlock.isAlreadyShiftedThisTime) {
      return;
    }

    this.shiftBlock.isAlreadyShiftedThisTime = true;

    if (this.shiftBlock.isShiftedBlockEmpty()) {
      this.shiftBlock.setShiftBlock(this.controlBlock.controlBlockType);
      this.controlBlock.addNewControlBlock();
    } else {
      let tmpBlockType = this.shiftBlock.shiftedBlock;
      this.shiftBlock.setShiftBlock(this.controlBlock.controlBlockType);
      this.changeControlBlock(tmpBlockType);
    }

    this.reDraw();
  }

  changeControlBlock(controlBlockType) {
    this.controlBlock.changeContorlBlock(controlBlockType);
  }

  checkIsGameOver(stackedBlocks) {
    for (let x = 0; x < widthBlockCount; x++) {
      if (stackedBlocks[x][1].isExist) {
        return true;
      }
    }
    return false;
  }

  reDraw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawBlocks();
  }

  onEventLeftArrow() {
    if (
      couldBlockMoveToLeft(
        this.controlBlock.blockArray,
        this.stackedBlock.blockArray
      )
    ) {
      moveToLeftOneLine(this.controlBlock.blockArray);
    }
  }

  onEventRightArrow() {
    if (
      couldBlockMoveToRight(
        this.controlBlock.blockArray,
        this.stackedBlock.blockArray
      )
    ) {
      moveToRightOneLine(this.controlBlock.blockArray);
    }
  }

  onEventDownArrow() {
    this.flowGravity();
  }

  onEventUpArrow() {
    this.controlBlock.rotateBlock(
      this.controlBlock,
      this.controlBlock.blockArray,
      this.stackedBlock.blockArray,
      allowableRotationRange,
      true
    );
  }

  onEventSpace() {
    this.isSpaceDownRunning = true;
    while (this.isSpaceDownRunning) {
      this.flowGravity();
    }
  }

  onEventShift() {
    this.shiftControlBlock();
  }

  onEventKeyQ() {
    this.controlBlock.rotateBlock(
      this.controlBlock,
      this.controlBlock.blockArray,
      this.stackedBlock.blockArray,
      allowableRotationRange,
      false
    );
  }

  onEventKeyE() {
    this.controlBlock.rotateBlock(
      this.controlBlock,
      this.controlBlock.blockArray,
      this.stackedBlock.blockArray,
      allowableRotationRange,
      true
    );
  }

  onEventKeyZ() {
    this.controlBlock.rotateBlock(
      this.controlBlock,
      this.controlBlock.blockArray,
      this.stackedBlock.blockArray,
      allowableRotationRange,
      false
    );
  }

  onEventKeyC() {
    this.controlBlock.rotateBlock(
      this.controlBlock,
      this.controlBlock.blockArray,
      this.stackedBlock.blockArray,
      allowableRotationRange,
      true
    );
  }
}

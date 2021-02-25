/**
 * canvas setting
 */
const topMargin = -30;
const leftMargin = 100;

/**
 * block UI setting
 */
const borderWidth = 3;
const blockSize = 25;
const widthBlockCount = 10;
const widthBlockPaddingCount = 3;
const heightBlockCount = 25;

class GameScreen {
  constructor() {
    this.canvas = document.getElementById("canvas");

    this.ctx = canvas.getContext("2d");

    this.stackedBlock = new StakedBlock();
    this.controlBlock = new ControlBlock();
    this.shiftBlock = new ShiftBlock();
    this.previewBlockManager = new PreviewBlockManager();
    this.isSpaceDownRunning = false;
  }

  drawBlocks() {
    //logBlockArray(this.controlBlock.blockArray);
    this.drawTetrisBlocks();
    this.drawNextBlocks();
    this.drawShiftBlock();
  }

  drawTetrisBlocks() {
    for (let x = 0; x < widthBlockCount; x++) {
      for (let y = 0; y < heightBlockCount; y++) {
        let stackedSingleBlock = this.stackedBlock.blockArray[x][y];
        if (stackedSingleBlock.isExist) {
          this.ctx.fillStyle = stackedSingleBlock.blockColor;
        } else {
          this.ctx.fillStyle = "#37393A";
        }

        let controlSingleBlock = this.controlBlock.blockArray[x][y];
        if (controlSingleBlock.isExist) {
          this.ctx.fillStyle = controlSingleBlock.blockColor;
        }

        this.ctx.fillRect(
          borderWidth * x + blockSize * x + leftMargin,
          borderWidth * y + blockSize * y + topMargin,
          blockSize,
          blockSize
        );
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
      allowableRotationRange
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
}

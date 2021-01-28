class GameScreen {
  constructor() {
    this.canvas = document.getElementById("canvas");

    this.ctx = canvas.getContext("2d");

    this.stackedBlock = new StakedBlock();
    this.controlBlock = new ControlBlock();
    this.isSpaceDownRunning = false;
  }

  drawBlocks() {
    //logBlockArray(this.controlBlock.blockArray);
    for (let x = 0; x < widthBlockCount; x++) {
      for (let y = 0; y < heightBlockCount; y++) {
        if (this.stackedBlock.blockArray[x][y]) {
          this.ctx.fillStyle = "black";
        } else {
          this.ctx.fillStyle = "gray";
        }

        if (this.controlBlock.blockArray[x][y]) {
          this.ctx.fillStyle = "blue";
        }

        this.ctx.fillRect(
          borderWidth * x + blockSize * x,
          borderWidth * y + blockSize * y + topMargin,
          blockSize,
          blockSize
        );
      }
    }
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
        this.controlBlock.makeRandomType();
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
        if (!stackedBlockArray[x][y]) {
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
        stackedBlockArray[x][y] = stackedBlockArray[x][y - 1];
      }
    }
  }

  addBlocksToStackedArray(controlBlocks, stackedBlocks) {
    for (let x = 0; x < widthBlockCount; x++) {
      for (let y = 0; y < heightBlockCount; y++) {
        if (controlBlocks[x][y]) {
          stackedBlocks[x][y] = true;
        }
      }
    }
  }

  checkIsGameOver(stackedBlocks) {
    for (let x = 0; x < widthBlockCount; x++) {
      if (stackedBlocks[x][1]) {
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
      this.stackedBlock.blockArray
    );
  }

  onEventSpace() {
    this.isSpaceDownRunning = true;
    while (this.isSpaceDownRunning) {
      this.flowGravity();
    }
  }
}

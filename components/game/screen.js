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
      this.controlBlock.makeRandomType();
      this.controlBlock.addNewControlBlock();
    }

    this.reDraw();
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
    if (
      couldBlockMoveToBottom(
        this.controlBlock.blockArray,
        this.stackedBlock.blockArray
      )
    ) {
      moveToBottomOneLine(this.controlBlock.blockArray);
    }
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

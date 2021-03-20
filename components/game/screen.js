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
const outBorderBlockCount = 3;
const blockShadowOpacity = "cc";
const blockShadowOpacity2 = "55";

class GameScreen {
  constructor() {
    this.canvas = document.getElementById("canvas");
    this.dropSound = document.getElementById("sound-drop");
    this.shiftSound = document.getElementById("sound-shift");
    this.clearLineSound = document.getElementById("sound-clear_line");
    this.gameOverSound = document.getElementById("sound-game_over");
    this.background = {}
    this.background.canvas = document.getElementById("background");
    this.background.ctx = this.background.canvas.getContext("2d")
    this.shouldUpdateStackedLayer = false;

    this.ctx = canvas.getContext("2d");

    this.stackedBlock = new StakedBlock();
    this.controlBlock = new ControlBlock();
    this.shiftBlock = new ShiftBlock();
    this.previewBlockManager = new PreviewBlockManager();
    this.isSpaceDownRunning = false;
    this.collisionDelay = 0;
    this.init();
  }

  init() {
    this.flowGravity();
    this.initializeBackgroundLayer();
  }

  initializeBackgroundLayer() {
    for (
        let x = outBorderBlockCount;
        x < widthBlockCount + outBorderBlockCount;
        x++
    ) {
        let blockColor = "#37393A";
        for (let y = hideTopLine; y < heightBlockCount; y++) {
            this.drawBlock(x, y, this.background.ctx, blockColor)
            this.drawTopLeftShadow(x, y, this.background.ctx, blockColor)
        }

    }
  }

  drawBlock(x, y, ctx, color) {
    ctx.fillStyle = "#FFFFFF"
    ctx.fillRect(
        borderWidth * (x - outBorderBlockCount) +
        blockSize * (x - outBorderBlockCount) +
        leftMargin,
        borderWidth * y + blockSize * y + topMargin,
        blockSize,
        blockSize
    );

    ctx.fillStyle = color + blockShadowOpacity;
    
    ctx.fillRect(
        borderWidth * (x - outBorderBlockCount) +
        blockSize * (x - outBorderBlockCount) +
        leftMargin,
        borderWidth * y + blockSize * y + topMargin,
        blockSize,
        blockSize
    );
  }


  drawTopLeftShadow(x, y, ctx, color) {
    ctx.fillStyle = color + blockShadowOpacity2;
    ctx.fillRect(
        borderWidth * (x - outBorderBlockCount) +
        blockSize * (x - outBorderBlockCount) +
        leftMargin,
        borderWidth * y + blockSize * y + topMargin,
        blockSize,
        shadowWidth
    );
    ctx.fillRect(
        borderWidth * (x - outBorderBlockCount) +
        blockSize * (x - outBorderBlockCount) +
        leftMargin,
        borderWidth * y + blockSize * y + topMargin,
        shadowWidth,
        blockSize
    );
  }

  drawBottomRightShadow(x, y, ctx, color) {
      ctx.fillStyle = color;
      ctx.fillRect(
          borderWidth * (x - outBorderBlockCount) +
          blockSize * (x - outBorderBlockCount) +
          leftMargin,
          borderWidth * y +
          blockSize * y +
          topMargin +
          blockSize -
          shadowWidth,
          blockSize,
          shadowWidth
      )
      ctx.fillRect(
          borderWidth * (x - outBorderBlockCount) +
          blockSize * (x - outBorderBlockCount) +
          leftMargin +
          blockSize -
          shadowWidth,
          borderWidth * y + blockSize * y + topMargin,
          shadowWidth,
          blockSize
      );
  }

  clearPrevRect(x, y, ctx) {
    ctx.clearRect(
        borderWidth * (x - outBorderBlockCount) +
        blockSize * (x - outBorderBlockCount) +
        leftMargin,
        borderWidth * y + blockSize * y + topMargin
        , y,
        blockSize,
        blockSize
    );
    ctx.clearRect(
        borderWidth * (x - outBorderBlockCount) +
        blockSize * (x - outBorderBlockCount) +
        leftMargin,
        borderWidth * y +
        blockSize * y +
        topMargin +
        blockSize -
        shadowWidth,
        blockSize,
        shadowWidth
    )
    ctx.clearRect(
        borderWidth * (x - outBorderBlockCount) +
        blockSize * (x - outBorderBlockCount) +
        leftMargin,
        borderWidth * y + blockSize * y + topMargin,
        blockSize,
        blockSize
    );
  }

  drawBlocks() {
    this.drawControlTetrisBlocks();
    if(this.shouldUpdateStackedLayer) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawStackedTetrisBlocks();
        this.shouldUpdateStackedLayer = false;
    }
    this.drawNextBlocks();
    this.drawShiftBlock();
  }

    drawControlTetrisBlocks() {
      for (
          let x = outBorderBlockCount;
          x < widthBlockCount + outBorderBlockCount;
          x++
      ) {
          for (let y = hideTopLine; y < heightBlockCount; y++) {
              let controlSingleBlock = this.controlBlock.blockArray[x][y];
              //Clear the blocks maked as previous rendered
              if(controlSingleBlock.isPrevExisted) {
                this.clearPrevRect(x,y, this.ctx)
                controlSingleBlock.isPrevExisted = false;
              }
              if (!controlSingleBlock.isExist) {
                  continue
              }
              let blockColor = controlSingleBlock.blockColor;

              this.drawBlock(x, y, this.ctx, blockColor)

              this.drawTopLeftShadow(x, y, this.ctx, blockColor)

              if (controlSingleBlock.isExist || stackedSingleBlock.isExist) {
                  this.drawBottomRightShadow(x, y, this.ctx, blockColor)
              }
          }
      }
  }

  drawStackedTetrisBlocks() {
      for (
          let x = outBorderBlockCount;
          x < widthBlockCount + outBorderBlockCount;
          x++
      ) {
          for (let y = hideTopLine; y < heightBlockCount; y++) {
              let stackedSingleBlock = this.stackedBlock.blockArray[x][y];
              let controlSingleBlock = this.controlBlock.blockArray[x][y];

              if (!stackedSingleBlock.isExist) {
                  continue;
              }

              let blockColor = stackedSingleBlock.blockColor;

              this.drawBlock(x, y, this.ctx, blockColor)

              this.drawTopLeftShadow(x, y, this.ctx, blockColor)

              if (controlSingleBlock.isExist || stackedSingleBlock.isExist) {
                  this.drawBottomRightShadow(x, y, this.ctx, blockColor)
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
    } else if (this.collisionDelay < collisionDelayCount) {
      this.collisionDelay++;
    } else {
      this.playDropSound();
      this.shiftBlock.isAlreadyShiftedThisTime = false;
      this.isSpaceDownRunning = false;
      this.collisionDelay = 0;
      this.addBlocksToStackedArray(
        this.controlBlock.blockArray,
        this.stackedBlock.blockArray
      );
      let removedLineCount = this.removeCompletedLine(0);
      addScore(removedLineCount);

      if (this.checkIsGameOver(this.stackedBlock.blockArray)) {
        this.controlBlock.removeControlBlock();
        this.playGameOverSound();
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
    for (let y = 0; y < heightBlockCount + outBorderBlockCount; y++) {
      let isCompletedLine = true;
      for (
        let x = outBorderBlockCount;
        x < widthBlockCount + outBorderBlockCount;
        x++
      ) {
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

    if (lineCount > 0) {
      this.playClearLineSound();
    }

    return lineCount;
  }

  removeLine(removeY) {
    let stackedBlockArray = this.stackedBlock.blockArray;
    for (let y = removeY; y > 0; y--) {
      for (let x = 0; x < widthBlockCount + outBorderBlockCount * 2; x++) {
        copySingleBlock(stackedBlockArray[x][y], stackedBlockArray[x][y - 1]);
      }
    }
  }

  addBlocksToStackedArray(controlBlocks, stackedBlocks) {
    for (let x = 0; x < widthBlockCount + outBorderBlockCount * 2; x++) {
      for (let y = 0; y < heightBlockCount + outBorderBlockCount; y++) {
        if (controlBlocks[x][y].isExist) {
          copySingleBlock(stackedBlocks[x][y], controlBlocks[x][y]);
        }
      }
    }
    this.shouldUpdateStackedLayer = true;
  }

  shiftControlBlock() {
    if (this.shiftBlock.isAlreadyShiftedThisTime) {
      return;
    }

    this.shiftBlock.isAlreadyShiftedThisTime = true;
    this.playShiftSound();

    if (this.shiftBlock.isShiftedBlockEmpty()) {
      this.shiftBlock.setShiftBlock(this.controlBlock.controlBlockType);
      this.controlBlock.addNewControlBlock();
    } else {
      let tmpBlockType = this.shiftBlock.shiftedBlock;
      this.shiftBlock.setShiftBlock(this.controlBlock.controlBlockType);
      this.changeControlBlock(tmpBlockType);
    }
    this.reDraw()
    this.flowGravity();
  }

  changeControlBlock(controlBlockType) {
    this.controlBlock.changeContorlBlock(controlBlockType);
  }

  checkIsGameOver(stackedBlocks) {
    for (
      let x = outBorderBlockCount;
      x < widthBlockCount + outBorderBlockCount;
      x++
    ) {
      if (stackedBlocks[x][1].isExist) {
        return true;
      }
    }
    return false;
  }

  playDropSound() {
    if (!this.dropSound.ended) {
      this.stopDropSound();
    }
    this.dropSound.play();
  }

  stopDropSound() {
    this.dropSound.pause();
    this.dropSound.currentTime = 0.0;
  }

  playShiftSound() {
    if (!this.shiftSound.ended) {
      this.stopShiftSound();
    }
    this.shiftSound.play();
  }

  stopShiftSound() {
    this.shiftSound.pause();
    this.shiftSound.currentTime = 0.0;
  }

  playClearLineSound() {
    if (!this.clearLineSound.ended) {
      this.stopClearLineSound();
    }
    this.clearLineSound.play();
  }

  stopClearLineSound() {
    this.clearLineSound.pause();
    this.clearLineSound.currentTime = 0.0;
  }

  playGameOverSound() {
    if (!this.gameOverSound.ended) {
      this.stopGameOverSound();
    }
    this.gameOverSound.play();
  }

  stopGameOverSound() {
    this.gameOverSound.pause();
    this.gameOverSound.currentTime = 0.0;
  }

  reDraw() {
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
    this.controlBlock.rotate(
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
    this.controlBlock.rotate(
      this.controlBlock,
      this.controlBlock.blockArray,
      this.stackedBlock.blockArray,
      allowableRotationRange,
      false
    );
  }

  onEventKeyE() {
    this.controlBlock.rotate(
      this.controlBlock,
      this.controlBlock.blockArray,
      this.stackedBlock.blockArray,
      allowableRotationRange,
      true
    );
  }

  onEventKeyZ() {
    this.controlBlock.rotate(
      this.controlBlock,
      this.controlBlock.blockArray,
      this.stackedBlock.blockArray,
      allowableRotationRange,
      false
    );
  }

  onEventKeyC() {
    this.controlBlock.rotate(
      this.controlBlock,
      this.controlBlock.blockArray,
      this.stackedBlock.blockArray,
      allowableRotationRange,
      true
    );
  }
}

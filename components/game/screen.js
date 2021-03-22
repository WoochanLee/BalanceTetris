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
    this.renderer = new Renderer()
    this.audioPlayer = new AudioPlayer();
    this.canvas = document.getElementById("canvas");
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
    this.flowGravityWithDraw();
  }

  drawBlocks() {
    this.renderer.renderWtihMerge(this.controlBlock.blockArray, this.stackedBlock.blockArray)
    this.drawNextBlocks();
    this.drawShiftBlock();
  }

  drawNextBlocks() {
    this.previewBlockManager.setBlockType(this.controlBlock.previewBlockQueue);
    this.previewBlockManager.draw(this.ctx);
  }

  drawShiftBlock() {
    this.shiftBlock.draw(this.ctx);
  }

  flowGravityWithDraw() {
    this.flowGravity()
    this.drawBlocks();
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
      this.audioPlayer.play(dropSound);
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
        this.audioPlayer.play(gameOverSound);
        gameOver();
      } else {
        this.controlBlock.addNewControlBlock();
        levelUp();
        this.flowGravityWithDraw();
        rewindTimer();
      }
    }
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
      this.audioPlayer.play(clearLineSound);
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
    this.audioPlayer.play(shiftSound);

    if (this.shiftBlock.isShiftedBlockEmpty()) {
      this.shiftBlock.setShiftBlock(this.controlBlock.controlBlockType);
      this.controlBlock.addNewControlBlock();
    } else {
      let tmpBlockType = this.shiftBlock.shiftedBlock;
      this.shiftBlock.setShiftBlock(this.controlBlock.controlBlockType);
      this.changeControlBlock(tmpBlockType);
    }
    this.flowGravityWithDraw()
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
    this.flowGravityWithDraw();
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
    this.drawBlocks()
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

const shiftBackgroundColor = "#444444";

/**
 * shift block setting
 */
const shiftBlockLocationX = 50;
const shiftBlockLocationY = 50;

const shiftBlockRadius = 45;

class ShiftBlock {
  constructor() {
    this.shiftBorderWidth = shiftBlockRadius / 45;
    this.shiftBlockSize = (shiftBlockRadius * 4) / 15;
    this.shiftBlockShadowWidth = shiftBlockRadius / 15;
    this.shiftedBlock = null;
    this.isAlreadyShiftedThisTime = false;
  }

  setShiftBlock(controlBlockType) {
    this.shiftedBlock = controlBlockType;
    this.refreshData();
  }

  isShiftedBlockEmpty() {
    if (this.shiftedBlock == null) {
      return true;
    } else {
      return false;
    }
  }

  refreshData() {
    this.blockType = this.shiftedBlock.blockType;

    let widthBlockCount = this.blockType.widthBlockCount;
    let widthBlockMarginCount = this.blockType.widthBlockMarginCount;
    let heightBlockCount = this.blockType.heightBlockCount;
    let heightBlockMarginCount = this.blockType.heightBlockMarginCount;

    this.shiftBackgroundWidthPadding =
      shiftBlockRadius -
      this.shiftBlockSize * widthBlockMarginCount -
      this.shiftBorderWidth * widthBlockMarginCount -
      (this.shiftBlockSize * widthBlockCount +
        this.shiftBorderWidth * (widthBlockCount - 1)) /
        2;

    this.shiftBackgroundHeightPadding =
      shiftBlockRadius -
      this.shiftBlockSize * heightBlockMarginCount -
      this.shiftBorderWidth * heightBlockMarginCount -
      (this.shiftBlockSize * heightBlockCount +
        (this.shiftBorderWidth * heightBlockCount - 1)) /
        2;
  }

  draw(ctx) {
    this.drawBackgroundCircle(ctx);
    if (!this.isShiftedBlockEmpty()) {
      this.drawShiftBlock(ctx);
    }
  }

  drawBackgroundCircle(ctx) {
    ctx.fillStyle = shiftBackgroundColor;
    ctx.beginPath();
    ctx.arc(
      shiftBlockLocationX,
      shiftBlockLocationY,
      shiftBlockRadius,
      0,
      Math.PI * 2,
      false
    );
    ctx.fill();
  }

  drawShiftBlock(ctx) {
    for (let i = 0; i < this.blockType.shape.length; i++) {
      let blockColor = this.blockType.blockColor;
      ctx.fillStyle = blockColor + blockShadowOpacity;

      let blockX = this.blockType.shape[i][0];
      let blockY = this.blockType.shape[i][1];

      let blockLocationX =
        shiftBlockLocationX +
        this.shiftBlockSize * blockX +
        this.shiftBorderWidth * blockX -
        shiftBlockRadius +
        this.shiftBackgroundWidthPadding;

      let blockLocationY =
        shiftBlockLocationY +
        this.shiftBlockSize * blockY +
        this.shiftBorderWidth * blockY -
        shiftBlockRadius +
        this.shiftBackgroundHeightPadding;

      ctx.fillRect(
        blockLocationX,
        blockLocationY,
        this.shiftBlockSize,
        this.shiftBlockSize
      );

      //draw shadow
      ctx.fillStyle = blockColor;
      ctx.fillRect(
        blockLocationX,
        blockLocationY,
        this.shiftBlockShadowWidth,
        this.shiftBlockSize
      );

      ctx.fillRect(
        blockLocationX,
        blockLocationY,
        this.shiftBlockSize,
        this.shiftBlockShadowWidth
      );
    }
  }
}

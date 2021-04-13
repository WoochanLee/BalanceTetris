import { blockShadowOpacity,
shiftBackgroundColor,
shiftBlockLocationX,
shiftBlockLocationY,
shiftBlockRadius } from "../../utils/constants";


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

  init(ctx) {
    this._drawTitle(ctx);
  }

  draw(ctx) {
    this.drawBackgroundCircle(ctx);
    if (!this.isShiftedBlockEmpty()) {
      this.drawShiftBlock(ctx);
    }
  }

  _drawTitle(ctx) {
    ctx.font = '16px -apple-system, BlinkMacSystemFont, Open Sans, sans-serif';
    ctx.fillStyle = shiftBackgroundColor;
    ctx.textAlign = "center";
    ctx.fillText('HOLD', shiftBlockLocationX, shiftBlockLocationY - 55);
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

export { ShiftBlock };

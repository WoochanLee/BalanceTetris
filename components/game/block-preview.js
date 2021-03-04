const previewBackgroundColor = "#444444";

/**
 * preview block setting
 */
const previewBlockLocation = [
  [440, 50],
  [440, 140],
  [440, 210],
  [440, 280],
];

const justPreviewBlockRadius = 45;
const previewBlockRadius = 30;

class PreviewBlockManager {
  constructor() {
    this.previewBlockArray = new Array(4);
    for (let i = 0; i < previewBlockLocation.length; i++) {
      let radius;
      if (i == 0) {
        radius = justPreviewBlockRadius;
      } else {
        radius = previewBlockRadius;
      }
      this.previewBlockArray[i] = new PreviewBlock(
        previewBlockLocation[i][0],
        previewBlockLocation[i][1],
        radius
      );
    }
  }

  setBlockType(previewBlockQueue) {
    for (let i = 0; i < this.previewBlockArray.length; i++) {
      this.previewBlockArray[i].setBlockType(previewBlockQueue.get(i));
    }
  }

  draw(ctx) {
    for (let i = 0; i < this.previewBlockArray.length; i++) {
      this.previewBlockArray[i].draw(ctx);
    }
  }
}

class PreviewBlock {
  constructor(locationX, locationY, radius) {
    this.locationX = locationX;
    this.locationY = locationY;
    this.radius = radius;
    this.previewBorderWidth = radius / 45;
    this.previewBlockSize = (radius * 4) / 15;
    this.previewBlockShadowWidth = radius / 15;
  }

  setBlockType(controlBlockType) {
    this.blockType = controlBlockType.blockType;

    let widthBlockCount = this.blockType.widthBlockCount;
    let widthBlockMarginCount = this.blockType.widthBlockMarginCount;
    let heightBlockCount = this.blockType.heightBlockCount;
    let heightBlockMarginCount = this.blockType.heightBlockMarginCount;

    this.previewBackgroundWidthPadding =
      this.radius -
      this.previewBlockSize * widthBlockMarginCount -
      this.previewBorderWidth * widthBlockMarginCount -
      (this.previewBlockSize * widthBlockCount +
        this.previewBorderWidth * (widthBlockCount - 1)) /
        2;

    this.previewBackgroundHeightPadding =
      this.radius -
      this.previewBlockSize * heightBlockMarginCount -
      this.previewBorderWidth * heightBlockMarginCount -
      (this.previewBlockSize * heightBlockCount +
        (this.previewBorderWidth * heightBlockCount - 1)) /
        2;
  }

  draw(ctx) {
    this.drawBackgroundCircle(ctx);
    this.drawPreviewBlock(ctx);
  }

  drawBackgroundCircle(ctx) {
    ctx.fillStyle = previewBackgroundColor;
    ctx.beginPath();
    ctx.arc(this.locationX, this.locationY, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
  }

  drawPreviewBlock(ctx) {
    for (let i = 0; i < this.blockType.shape.length; i++) {
      let blockColor = this.blockType.blockColor;
      ctx.fillStyle = blockColor + blockShadowOpacity;

      let blockX = this.blockType.shape[i][0];
      let blockY = this.blockType.shape[i][1];

      let blockLocationX =
        this.locationX +
        this.previewBlockSize * blockX +
        this.previewBorderWidth * blockX -
        this.radius +
        this.previewBackgroundWidthPadding;

      let blockLocationY =
        this.locationY +
        this.previewBlockSize * blockY +
        this.previewBorderWidth * blockY -
        this.radius +
        this.previewBackgroundHeightPadding;

      ctx.fillRect(
        blockLocationX,
        blockLocationY,
        this.previewBlockSize,
        this.previewBlockSize
      );

      //draw shadow
      ctx.fillStyle = blockColor;
      ctx.fillRect(
        blockLocationX,
        blockLocationY,
        this.previewBlockShadowWidth,
        this.previewBlockSize
      );

      ctx.fillRect(
        blockLocationX,
        blockLocationY,
        this.previewBlockSize,
        this.previewBlockShadowWidth
      );
    }
  }
}

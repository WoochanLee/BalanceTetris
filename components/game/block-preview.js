//const previewBlockCount = 4;
const previewBackgroundColor = "blue";
const previewBlockColor = "#828282";

class PreviewBlock {
  constructor(locationX, locationY, radius) {
    this.locationX = locationX;
    this.locationY = locationY;
    this.radius = radius;
    this.previewBorderWidth = radius / 15;
    this.previewBlockSize = (radius * 4) / 15;
  }

  setBlockType(blockType) {
    this.blockType = blockType;

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
    console.log(
      this.radius -
        this.previewBlockSize * heightBlockMarginCount -
        this.previewBorderWidth * heightBlockMarginCount -
        (this.previewBlockSize * heightBlockCount +
          (this.previewBorderWidth * heightBlockCount - 1)) /
          2
    );

    console.log(heightBlockMarginCount);
    console.log(this.previewBorderWidth * heightBlockMarginCount);
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
    ctx.fillStyle = previewBlockColor;
    // for (let x = 0; x < previewBlockCount; x++) {
    //   for (let y = 0; y < previewBlockCount; y++) {
    //     let blockLocationX =
    //       this.previewBorderWidth * x +
    //       this.previewBlockSize * x +
    //       this.locationX -
    //       this.radius +
    //       this.previewBackgroundPadding;

    //     let blockLocationY =
    //       this.previewBorderWidth * y +
    //       this.previewBlockSize * y +
    //       this.locationY -
    //       this.radius +
    //       this.previewBackgroundPadding;

    //     ctx.fillRect(
    //       blockLocationX,
    //       blockLocationY,
    //       this.previewBlockSize,
    //       this.previewBlockSize
    //     );
    //   }
    // }

    ctx.fillStyle = "black";
    for (let i = 0; i < this.blockType.shape.length; i++) {
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
    }
  }
}

/*
  renderer.js
  
  This is a rendering module.
  Authored by BT community
  
  Renderer's goal is to receive the blocks and draw them optimally.

  renderer's interface must be simple.
  
  'renderWithMerge(first, second)` function is a render call function which
   merge block arrays called 'stacked' and 'control' for the current game system.

   Do not call _ prefixed function outside of this class which means 'private'

*/

function initBlockArray(blockArray) {
  for (let x = 0; x < widthBlockCount + outBorderBlockCount * 2; x++) {
    blockArray[x] = new Array(heightBlockCount + outBorderBlockCount);
    for (let y = 0; y < heightBlockCount + outBorderBlockCount; y++) {
      blockArray[x][y] = {
        isExisted: false,
        isDifferent: false,
        blockColor: null,
      };
    }
  }
}


class Renderer {
  constructor() {
    this.main = {}
    this.background = {}

    this.main.canvas = document.getElementById("canvas");
    this.main.contxt = this.main.canvas.getContext("2d");

    this.background.canvas = document.getElementById("background");
    this.background.contxt = this.background.canvas.getContext("2d");
    this.previousRenderBlocks = new Array(widthBlockCount + outBorderBlockCount * 2)

    this.mergeCache = new Array(widthBlockCount + outBorderBlockCount * 2)

    initBlockArray(this.previousRenderBlocks)
    initBlockArray(this.mergeCache)

    this._initializeBackgroundLayer()
  }

  renderWtihMerge(first, second) {
    const renderTarget = this._mergeArray(first, second)
    this._markDifferenceBetweenPreviousRenderedStatus(renderTarget)

    for (let x = outBorderBlockCount; x < widthBlockCount + outBorderBlockCount; x++) {
      for (let y = hideTopLine; y < heightBlockCount; y++) {
        let block = this.previousRenderBlocks[x][y];
        if (block.isDifferent) {
          this._clearPrevRect(x, y, this.main.contxt)

          if (renderTarget[x][y].isExist) {
            let blockColor = renderTarget[x][y].blockColor
            this._drawBlock(x, y, this.main.contxt, blockColor)
            this._drawTopLeftShadow(x, y, this.main.contxt, blockColor)
            this._drawBottomRightShadow(x, y, this.main.contxt, blockColor)
          }
          block.isDifferent = false;
        }
        block.isExist = renderTarget[x][y].isExist;
      }
    }
  }

  _initializeBackgroundLayer() {
    for (let x = outBorderBlockCount; x < widthBlockCount + outBorderBlockCount; x++) {
      let blockColor = "#37393A";
      for (let y = hideTopLine; y < heightBlockCount; y++) {
        this._drawBlock(x, y, this.background.contxt, blockColor)
        this._drawTopLeftShadow(x, y, this.background.contxt, blockColor)
      }
    }
  }
  _mergeArray(first, second) {
    for (let x = outBorderBlockCount; x < widthBlockCount + outBorderBlockCount; x++) {
      for (let y = hideTopLine; y < heightBlockCount; y++) {
        this.mergeCache[x][y].isExist = false;
        this.mergeCache[x][y].blockColor = null
        if (first[x][y].isExist) {
          this.mergeCache[x][y].isExist = true;
          this.mergeCache[x][y].blockColor = first[x][y].blockColor;
        }
        if (second[x][y].isExist) {
          this.mergeCache[x][y].isExist = true;
          this.mergeCache[x][y].blockColor = second[x][y].blockColor;
        }
      }
    }
    return this.mergeCache
  }

  _markDifferenceBetweenPreviousRenderedStatus(current) {
    for (let x = 0; x < widthBlockCount + outBorderBlockCount * 2; x++) {
      for (let y = 0; y < heightBlockCount + outBorderBlockCount; y++) {
        this.previousRenderBlocks[x][y].isDifferent =
          this.previousRenderBlocks[x][y].isExist != current[x][y].isExist ||
          this.previousRenderBlocks[x][y].blockColor != current[x][y].blockColor

      }
    }
  }


  _drawBlock(x, y, ctx, color) {
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


  _drawTopLeftShadow(x, y, ctx, color) {
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

  _drawBottomRightShadow(x, y, ctx, color) {
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

  _clearPrevRect(x, y, ctx) {
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
}
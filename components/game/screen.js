const canvas = document.getElementById("canvas");

const ctx = canvas.getContext("2d");

let stackedBlocks = new Array(widthBlockCount);
let controlBlocks = new Array(widthBlockCount);

function initBlockArray(blockArray) {
  for (let x = 0; x < widthBlockCount; x++) {
    blockArray[x] = new Array(heightBlockCount);
  }

  clearBlockArray(blockArray);
}

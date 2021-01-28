function logBlockArray(blockArray) {
  for (let y = 0; y < heightBlockCount; y++) {
    let line = "";
    for (let x = 0; x < widthBlockCount; x++) {
      if (blockArray[x][y]) {
        line += "□";
      } else {
        line += "■";
      }
    }
    console.log(line);
  }
}

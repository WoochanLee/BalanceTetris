function logBlockArray(blockArray) {
  for (let y = 0; y < heightBlockCount; y++) {
    let line = "";
    for (
      let x = outBorderBlockCount;
      x < widthBlockCount + outBorderBlockCount * 2;
      x++
    ) {
      if (blockArray[x][y].isExist) {
        line += "□";
      } else {
        line += "■";
      }
    }
    console.log(line);
  }
}

const shuffleArray = (array) => {
  for (let i = 0; i < array.length; i++) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

class Queue {
  constructor() {
    this._arr = [];
  }
  enqueue(item) {
    this._arr.push(item);
  }
  dequeue() {
    return this._arr.shift();
  }
  get(i) {
    return this._arr[i];
  }
}

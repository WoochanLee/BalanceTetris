/**
 ****□□□□****
 **/
class BlockTypeOne {
  constructor() {
    this.shape = [
      [3, 1],
      [4, 1],
      [5, 1],
      [6, 1],
    ];
    this.rotationBlueprint = [
      [
        [2, -1],
        [2, 0],
        [2, 1],
        [2, 2],
      ],
      [
        [-2, 1],
        [-1, 1],
        [0, 1],
        [1, 1],
      ],
    ];
  }
}

//   /**
//    ****□□□*****
//    *****□******
//    **/
class BlockTypeTwo {
  constructor() {
    this.shape = [
      [4, 1],
      [5, 1],
      [5, 2],
      [6, 1],
    ];
    this.rotationBlueprint = [
      [
        [0, 0],
        [1, 1],
        [1, 0],
        [1, -1],
      ],
      [
        [0, 0],
        [1, -1],
        [1, 0],
        [2, 0],
      ],
      [
        [1, -1],
        [1, 0],
        [1, 1],
        [2, 0],
      ],
      [
        [-1, 1],
        [0, 1],
        [0, 2],
        [1, 1],
      ],
    ];
  }
}

//   /**
//    *****□□*****
//    *****□□*****
//    **/
//   addTypeThreeBlock() {
//     this.blockArray[4][0] = true;
//     this.blockArray[4][1] = true;
//     this.blockArray[5][0] = true;
//     this.blockArray[5][1] = true;
//   }
class BlockTypeThree {
  constructor() {
    this.shape = [
      [4, 1],
      [4, 2],
      [5, 1],
      [5, 2],
    ];
    this.rotationBlueprint = [];
  }
}

//   /**
//    ****□□******
//    *****□□*****
//    **/
class BlockTypeFour {
  constructor() {
    this.shape = [
      [4, 1],
      [5, 1],
      [5, 2],
      [6, 2],
    ];
    this.rotationBlueprint = [
      [
        [0, 1],
        [0, 2],
        [1, 0],
        [1, 1],
      ],
      [
        [0, -1],
        [1, -1],
        [1, 0],
        [2, 0],
      ],
    ];
  }
}
//   /**
//    *****□□*****
//    ****□□******
//    **/
class BlockTypeFive {
  constructor() {
    this.shape = [
      [4, 2],
      [5, 1],
      [5, 2],
      [6, 1],
    ];
    this.rotationBlueprint = [
      [
        [1, -1],
        [1, 0],
        [2, 0],
        [2, 1],
      ],
      [
        [-1, 1],
        [0, 0],
        [0, 1],
        [1, 0],
      ],
    ];
  }
}

//   /**
//    ******□****
//    ****□□□****
//    **/
class BlockTypeSix {
  constructor() {
    this.shape = [
      [4, 2],
      [5, 2],
      [6, 1],
      [6, 2],
    ];
    this.rotationBlueprint = [
      [
        [0, -2],
        [0, -1],
        [0, 0],
        [1, 0],
      ],
      [
        [0, 1],
        [0, 2],
        [1, 1],
        [2, 1],
      ],
      [
        [0, 0],
        [1, 0],
        [1, 1],
        [1, 2],
      ],
      [
        [0, 1],
        [1, 1],
        [2, 0],
        [2, 1],
      ],
    ];
  }
}

//   /**
//    ****□*******
//    ****□□□****
//    **/
class BlockTypeSeven {
  constructor() {
    this.shape = [
      [4, 1],
      [4, 2],
      [5, 2],
      [6, 2],
    ];
    this.rotationBlueprint = [
      [
        [1, 0],
        [1, 1],
        [1, 2],
        [2, 0],
      ],
      [
        [-1, 0],
        [0, 0],
        [1, 0],
        [1, 1],
      ],
      [
        [1, 1],
        [2, -1],
        [2, 0],
        [2, 1],
      ],
      [
        [-1, -1],
        [-1, 0],
        [0, 0],
        [1, 0],
      ],
    ];
  }
}

/**
 * 2048 game core 
 * @author:JA+ 
 */
export default class Core {
  constructor({ selector }) {
    this.selector = selector
    this.GAME_SCORE = 0;
    /**@type{Array<Array<{value:number}>>} */
    this.GAME; //全局游戏矩阵
    this.MATRIC_SIZE = 4; //默认矩阵大小为4
    this.rdNum = [2, 4]; //随机生成的数字集合，新数字会随机从中选择一个，并随机生成在矩阵空位
    this.newNumPosition = []; //新生成数字的坐标['x1-y1','x2-y2']
    this.moveUnit = 0; // 移动距离单位，方块大小+边距
    this.cubeElements = []; // 创建的每个方块元素
    this.tranDuration = 0.2; // move anm time
    this.createCubeElement(); // 创建方块元素
    this.initArr(); // 不传入矩阵则生成矩阵
    this.showGameTimeout = null;

    // 给Array原型加上判断数组是否相同的方法
    Array.prototype.equalTo = function equal(arr) {
      if (this.length != arr.length) return false; // array length not equal
      for (let i = 0; i < this.length; i++) {
        const row = this[i];
        if (Array.isArray(row)) {
          if (row.length != arr[i].length) return false;
          for (let j = 0; j < row.length; j++) {
            const val = row[j].value;
            if (val !== arr[i][j].value) return false;
          }
        }
      }
      return true;
    }
  }

  /** init game array*/
  initArr() {
    this.GAME = new Array(this.MATRIC_SIZE);
    for (let i = 0; i < this.MATRIC_SIZE; i++) {
      this.GAME[i] = new Array(this.MATRIC_SIZE);
      for (let j = 0; j < this.MATRIC_SIZE; j++) {
        let number = {
          value: 0, // value after move
          added: false, // has added into this cube
          to: null, // move destination coordinate
        }
        this.GAME[i][j] = number;
      }
    }
    this.setEmptyNum(); // create random number
    this.showGame();
  }
  /**create cube element */
  createCubeElement() {
    let gameDiv = document.querySelector(this.selector);
    if (!gameDiv) throw new Error('can not find the element:' + this.selector);
    let gameBg = document.createElement('div');
    gameBg.classList.add('game-background');
    gameDiv.append(gameBg); // add game background cube

    for (let i = 0; i < this.MATRIC_SIZE ** 2; i++) {
      let bgCube = document.createElement('div');
      gameBg.append(bgCube);
      let cube = document.createElement('div');
      cube.classList.add('num-cube');
      gameDiv.append(cube);
      this.cubeElements.push(cube);
    }
    this.moveUnit = parseFloat(getComputedStyle(this.cubeElements[0]).width) + 5;
  }

  /**
   * 集成控制上下左右
   * @param {String} direction ['up'|'down'|'left'|'right']
   */
  control(direction) {
    if(this.showGameTimeout) return; // last animation didnt end,cant move
    let beforeArr = JSON.parse(JSON.stringify(this.GAME));
    switch (direction) {
      case 'up':
        this.pushUp();
        break;
      case 'down':
        this.pushDown();
        break;
      case 'left':
        this.pushLeft();
        break;
      case 'right':
        this.pushRight();
        break;
    }
    // is array is equal to before array(is game moved)
    if (!this.GAME.equalTo(beforeArr)) {
      this.setEmptyNum();
      this.setMoveAnimation(direction);
      this.showGameTimeout = setTimeout(() => {
        this.showGame();
        this.showGameTimeout = null;
      }, this.tranDuration * 1000);

      if (this.isGameOver()) {
        setTimeout(() => {
          alert("2048 End!Your Score:" + this.GAME_SCORE);
        }, 500);
      }
    }
  }
  pushLeft() {
    let tempArr = JSON.parse(JSON.stringify(this.GAME)); // 保存矩阵用于先后比较是否相等
    for (const row of this.GAME) {
      // 数字左移
      this.arrLeft(row);
    }
    return this.GAME.equalTo(tempArr);
  }
  pushRight() {
    for (const row of this.GAME) {
      row.reverse(); // 反转
      this.arrLeft(row);
      row.reverse(); // 再反转
    }
  }
  pushUp() {
    this.switchXY(); // 对角线翻折
    this.pushLeft();
    this.switchXY();
  }
  pushDown() {
    this.switchXY();
    this.pushRight();
    this.switchXY();
  }

  /**
   * 将一维数组左移
   * @param {Array<Number>} arr 一维数组
   * @returns {Boolean} 表示矩阵是否有变化
   */
  arrLeft(arr) {
    for (let i = 0; i < arr.length; i++) {
      const val = arr[i].value;
      if (i == arr.length - 1 && val == 0) break;
      let j = i;
      let tmpNum = 0;
      if (val == 0) { // 是0的话就让下一个非零值占用这个位置
        for (++j; j < this.MATRIC_SIZE; j++) { // find the next number not 0
          if (arr[j].value > 0) break;
          else if (j == this.MATRIC_SIZE - 1) return; // all 0
        }
        tmpNum = arr[j].value; // store value
        arr[j].value = 0;
        arr[j].to = i; // where to move
      } else {
        tmpNum = arr[i].value; // store value
      }

      for (++j; j < this.MATRIC_SIZE; j++) { // find next number not 0
        if (arr[j].value != 0) { // not 0
          if (tmpNum == arr[j].value) { // same number merge
            tmpNum *= 2;
            arr[j].value = 0;
            arr[j].to = i;
            arr[i].added = true;
          }
          break;
        }
      }
      arr[i].value = tmpNum;
    }
  }
  /**
   * 交换矩阵的横纵坐标(斜对角翻折)
   */
  switchXY() {
    for (let i = 0; i < this.MATRIC_SIZE; i++) {
      for (let j = i + 1; j < this.MATRIC_SIZE; j++) {// 遍历行每行的i和每列的i交换
        let temp = this.GAME[j][i];
        this.GAME[j][i] = this.GAME[i][j];
        this.GAME[i][j] = temp;
      }
    }
  }

  /** 
   * 空位随机生成数字
   */
  setEmptyNum() {
    this.newNumPosition = []; // 新生成的数字坐标，用于加动画
    let temparr = [];//矩阵空位的坐标
    for (let i = 0; i < this.MATRIC_SIZE; i++) {
      for (let j = 0; j < this.MATRIC_SIZE; j++) {
        if (!this.GAME[i][j].value) {
          temparr.push([i, j]);//为0的坐标传入temparr
        }
      }
    }
    if (temparr.length != 0) { //空位不为0
      let rX = Math.floor(Math.random() * temparr.length);
      let [x, y] = temparr[rX]; // 随机的空位坐标
      this.newNumPosition.push(x + '-' + y);
      let newNum = this.rdNum[Math.floor(Math.random() * this.rdNum.length)];//自动生成数字填入
      this.GAME[x][y].value = newNum;
    }
  }

  /** 判断游戏是否结束 */
  isGameOver() {
    let isOver = true; //游戏结束判断标识符，默认结束
    this.GAME_SCORE = 0;
    //判断所有相邻位置没有相同的数  
    G1: for (let i = 0; i < this.MATRIC_SIZE; i++) {
      for (let j = 0; j < this.MATRIC_SIZE; j++) {
        if (this.GAME[i][j].value == this.GAME[i][j + 1]?.value ||
          this.GAME[j][i].value == this.GAME[j + 1]?.[i].value ||
          this.GAME[i][j].value == 0) {
          isOver = false; //游戏还能继续，取消结束状态
          break G1;
        }
        this.GAME_SCORE += this.GAME[i][j].value; // summary
      }
    }
    return isOver;
  }
  /**output array to html*/
  showGame() {
    for (let i = 0; i < this.MATRIC_SIZE; i++) {
      for (let j = 0; j < this.MATRIC_SIZE; j++) {
        let cubeEle = this.cubeElements[this.MATRIC_SIZE * i + j]
        let numObj = this.GAME[i][j];
        let num = numObj.value;
        cubeEle.style.setProperty('--moveX','0px');
        cubeEle.style.setProperty('--moveY','0px');
        cubeEle.style.setProperty('--duration', '0s'); // add translate time


        cubeEle.textContent = num || '';
        cubeEle.style.backgroundColor = NUM_COLOR_MAP[num] || null; // different number different color
        if(numObj.added){
          cubeEle.classList.remove('added');
          void cubeEle.offsetWidth; // trigger reflow
          cubeEle.classList.add('added');
        }
        if (this.newNumPosition.includes(i + '-' + j)) {
          cubeEle.classList.remove('scale');
          void cubeEle.offsetWidth; // trigger reflow
          cubeEle.classList.add('scale');
        }
        // reset numObj
        {
          numObj.to = null;
          numObj.added = false;
        }
      }
    }
  }
  /**cube moving animation */
  setMoveAnimation(direction) {
    for (let x = 0; x < this.MATRIC_SIZE; x++) {
      for (let y = 0; y < this.MATRIC_SIZE; y++) {
        let numObj = this.GAME[x][y];
        let cubeEle = this.cubeElements[this.MATRIC_SIZE * x + y];
        cubeEle.style.setProperty('--duration', this.tranDuration + 's'); // add translate time
        if (typeof numObj.to === 'number') {
          switch (direction) {
            case 'up':
              cubeEle.style.setProperty('--moveY', (numObj.to - x) * this.moveUnit + 'px');
              break;
            case 'down':
              cubeEle.style.setProperty('--moveY', (this.MATRIC_SIZE - 1 - numObj.to - x) * this.moveUnit + 'px');
              break;
            case 'left':
              cubeEle.style.setProperty('--moveX', (numObj.to - y) * this.moveUnit + 'px');
              break;
            case 'right':
              cubeEle.style.setProperty('--moveX', (this.MATRIC_SIZE - 1 - numObj.to - y) * this.moveUnit + 'px');
              break;
          }
        }
      }
    }
  }
}


const NUM_COLOR_MAP = {
  2: '#aaa',
  4: 'green',
  8: 'blue',
  16: 'cyan',
  32: 'orange',
  64: 'brown',
  128: 'violet',
  256: 'darkgreen',
  512: 'teal',
  1024: 'tomato',
  2048: 'red'
}

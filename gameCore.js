/**
 * 2048 game core 
 * @author:JA+ 
 */
export default class Core {
  constructor(gameArr) {
    this.GAME_SCORE = 0;
    this.GAME = gameArr; //全局游戏矩阵
    this.MATRIC_SIZE = 4; //默认矩阵大小为4
    this.rdNum = [2, 4]; //随机生成的数字集合，新数字会随机从中选择一个，并随机生成在矩阵空位
    this.newNumPosition = []; //新生成数字的坐标['x1-y1','x2-y2']
    if (!gameArr) this.initArr(); // 不传入矩阵则生成矩阵

    // 给Array原型加上判断数组是否相同的方法
    Array.prototype.equalTo = function equal(arr) {
      if (this.length != arr.length) return false; // 长度不相同不相等
      for (let i = 0; i < this.length; i++) {
        const row = this[i];
        if (Array.isArray(row)) {
          if (row.length != arr[i].length) return false;
          for (let j = 0; j < row.length; j++) {
            const val = row[j];
            if (val !== arr[i][j]) return false;
          }
        } else {
          if (row !== arr[i]) return false;
        }
      }
      return true;
    }
  }

  /** init game array*/
  initArr() {
    this.GAME = new Array(this.MATRIC_SIZE);
    for (let i = 0; i < this.MATRIC_SIZE; i++) {
      this.GAME[i] = new Array(this.MATRIC_SIZE).fill(0);
    }
    this.setEmptyNum(); // create random number
    this.showGame();
  }

  /**
   * 集成控制上下左右
   * @param {String} direction ['up'|'down'|'left'|'right']
   */
  control(direction) {
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
    // 移动前后判断矩阵是否相同，用于判断是否在空位生成新数字
    if (!this.GAME.equalTo(beforeArr)) {
      this.setEmptyNum();
      let isOver = this.isGameOver();
      this.showGame();
      if (isOver) {
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
      const val = arr[i];
      if (i == arr.length - 1 && val == 0) break;
      let j = i;
      let tmpNum = 0;
      if (val == 0) { // 是0的话就让下一个非零值占用这个位置
        for (++j; j < this.MATRIC_SIZE; j++) { // 找到第一个有值的
          if (arr[j] > 0) break;
          else if (j == this.MATRIC_SIZE - 1) return; // 全是0的情况
        }
        tmpNum = arr[j]; // 保存值
        arr[j] = 0;
      } else {
        tmpNum = arr[i]; // 保存值
      }

      for (++j; j < this.MATRIC_SIZE; j++) { // 这个数字后面找到第一个不为0的数字
        if (arr[j] != 0) {
          if (tmpNum == arr[j]) { // 相同的数字就合并
            tmpNum *= 2;
            arr[j] = 0;
          }
          break;
        }
      }
      arr[i] = tmpNum;
    }
  }
  /**
   * 交换矩阵的横纵坐标(斜对角翻折)
   */
  switchXY() {
    for (let i = 0; i < this.MATRIC_SIZE; i++) {
      for (let j = i + 1; j < this.MATRIC_SIZE; j++) {// 遍历行每行的i和每列的i交换
        this.GAME[i][j] ^= this.GAME[j][i];
        this.GAME[j][i] ^= this.GAME[i][j];
        this.GAME[i][j] ^= this.GAME[j][i];
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
        if (!this.GAME[i][j]) {
          temparr.push([i, j]);//为0的坐标传入temparr
        }
      }
    }
    if (temparr.length != 0) { //空位不为0
      let rX = Math.floor(Math.random() * temparr.length);
      let [x, y] = temparr[rX]; // 随机的空位坐标
      this.newNumPosition.push(x + '-' + y);
      this.GAME[x][y] = this.rdNum[Math.floor(Math.random() * this.rdNum.length)];//自动生成数字填入
    }
  }

  /** 判断游戏是否结束 */
  isGameOver() {
    let isOver = true; //游戏结束判断标识符，默认结束
    this.GAME_SCORE = 0;
    //判断所有相邻位置没有相同的数  
    G1: for (let i = 0; i < this.MATRIC_SIZE; i++) {
      for (let j = 0; j < this.MATRIC_SIZE; j++) {
        if (this.GAME[i][j] == this.GAME[i]?.[j + 1] || this.GAME[j][i] == this.GAME[j + 1]?.[i] || this.GAME[i][j] == 0) {
          isOver = false; //游戏还能继续，取消结束状态
          break G1;
        }
        this.GAME_SCORE += this.GAME[i][j]; // summary
      }
    }
    return isOver;
  }
  /**output array to html*/
  showGame() {
    let numCude = document.querySelectorAll("#gameDiv>.numCube");
    for (let i = 0; i < this.MATRIC_SIZE; i++) {
      for (let j = 0; j < this.MATRIC_SIZE; j++) {
        let num = this.GAME[i][j];
        let cube = numCude[this.MATRIC_SIZE * i + j]
        cube.textContent = num || '';
        cube.style.color = NUM_COLOR_MAP[num]; // different number different color
        if(this.newNumPosition.includes(i+ '-' + j)){
          cube.classList.remove('scale');
          void cube.offsetWidth; // trigger reflow
          cube.classList.add('scale');
        }
      }
    }
  }
}

const NUM_COLOR_MAP = {
  2: 'gray',
  4: 'green',
  8: 'blue',
  16: 'cyan',
  32: 'orange',
  64: 'brown',
  128: 'violte',
  256: 'darkgreen',
  512: 'teal',
  1024: 'tomato',
  2048: 'red'
}

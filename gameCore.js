/*2048.js author:chja */
export default class Core {
  constructor(gameArr) {
    this.GAME_SCORE = 0;
    this.GAME = gameArr;//全局游戏矩阵
    this.MATRIC_SIZE = 4;//默认矩阵大小为4
    this.rdNum = [2, 4];//随机生成的数字集合，新数字会随机从中选择一个，并随机生成在矩阵空位
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

  /** 初始化游戏矩阵 */
  initArr() {
    this.GAME = new Array(this.MATRIC_SIZE);
    for (let i = 0; i < this.MATRIC_SIZE; i++) {
      this.GAME[i] = new Array(this.MATRIC_SIZE).fill(0);
    }
    let pX = Math.floor(Math.random() * 4);//矩阵横坐标
    let pY = Math.floor(Math.random() * 4);//矩阵纵坐标
    this.GAME[pX][pY] = this.rdNum[Math.floor(Math.random() * this.rdNum.length)];//自动生成数字填入
  }

  /**集成控制上下左右 */
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
    if(!this.GAME.equalTo(beforeArr)){
      this.setEmptyNum();
      let isOver = this.isGameOver();
      this.showGame();
      if (isOver) {
        alert("2048 End!Your Score:" + this.GAME_SCORE);
      }
    }
  }
  /**左移 */
  pushLeft() {
    let tempArr = JSON.parse(JSON.stringify(this.GAME)); // 保存矩阵用于先后比较是否相等
    for (const row of this.GAME) {
      // 数字左移
      this.arrLeft(row);
    }
    return this.GAME.equalTo(tempArr);
  }
  /** 右移 */
  pushRight() {
    for (const row of this.GAME) {
      // 数字左移
      row.reverse(); // 反转
      this.arrLeft(row);
      row.reverse(); // 再反转
    }
  }
  /**上移 */
  pushUp() {
    this.switchXY(); // 对角线翻折
    this.pushLeft();
    this.switchXY();
  }
  /**下移 */
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
   * */
  setEmptyNum() {
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
      this.GAME[x][y] = this.rdNum[Math.floor(Math.random() * this.rdNum.length)];//自动生成数字填入
    }
  }

  /** 判断游戏是否结束 */
  isGameOver() {
    let isOver = true; //游戏结束判断标识符，默认结束
    //判断所有相邻位置没有相同的数  
    G1: for (let i = 0; i < this.MATRIC_SIZE; i++) {
      for (let j = 0; j < this.MATRIC_SIZE; j++) {
        if (this.GAME[i][j] == this.GAME[i]?.[j + 1] || this.GAME[j][i] == this.GAME[j + 1]?.[i] || this.GAME[i][j] == 0) {
          isOver = false; //游戏还能继续，取消结束状态
          break G1;
        }
        this.GAME_SCORE += this.GAME[i][j];//矩阵所有数据求和
      }
    }
    return isOver;
  }
  /**绘制矩阵*/
  showGame() {
    let numCude = document.querySelectorAll("#gameDiv>.numCube");
    for (let i = 0; i < this.MATRIC_SIZE; i++) {
      for (let j = 0; j < this.MATRIC_SIZE; j++) {
        numCude[this.MATRIC_SIZE * i + j].textContent = this.GAME[i][j] || '';    
      }
    }
  }
}
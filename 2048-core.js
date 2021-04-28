/*2048.js author:chja */
let game;//全局游戏矩阵
let MatricSize = 4;//默认矩阵大小为4
var rdNum = [2, 4];//随机生成的数字集合，新数字会随机从中选择一个，并随机生成在矩阵空位
/*测试矩阵*/
// let testgame = [[1,2,3,2],[3,4,2,1],[5,6,7,8],[11,12,13,14]];
// game = testgame;

/** 初始化游戏矩阵 */
function initArr(size) {
    game = new Array(size);
    for (var i = 0; i < game.length; i++) {
        game[i] = new Array(game.length);
        for (var j = 0; j < game.length; j++) {
            game[i][j] = 0;
        }
    }
    var pX = parseInt(Math.random() * 4);//矩阵横坐标
    var pY = parseInt(Math.random() * 4);//矩阵纵坐标
    game[pX][pY] = rdNum[parseInt(Math.random() * rdNum.length)];//自动生成数字填入
}
//main
export function gameStart() {
    initArr(MatricSize);
    showGame(game);
};

/**
 * 左移 
 * 原理：从第一位开始，若为0则判断后面的不为0的数字交换。 
 * */
export function pushLeft() {
    var arr = game;
    var isMove = 0; //记录矩阵是否有移动
    for (var i = 0; i < arr.length; i++) {
        //移动操作
        for (var j = 0; j < arr.length; j++) {
            for (var k = j + 1; k < arr.length; k++) {
                if (arr[i][j] == 0 && arr[i][k] != 0) {
                    //两数交换位置，通过异或交换算法。前提是需要保证交换的两个数不相等。
                    arr[i][j] ^= arr[i][k];
                    arr[i][k] ^= arr[i][j];
                    arr[i][j] ^= arr[i][k];
                    isMove = 1;//矩阵数字发生位移，则记为移动。
                }
            }
        }
        //加
        for (var l = 0; l < arr.length - 2; l++) {
            if (arr[i][l] == arr[i][l + 1]) { //与后面的数判断，若两数相同
                arr[i][l] += arr[i][l + 1];  //两数相加，结果赋给前面的数
                arr[i].splice(l + 1, 1);      //去0
                arr[i].push(0); //最后一位加0
                isMove = 1; //矩阵数字发生相加，则记为移动。
            }
        }
    }
    if (isMove) setEmptyNum(); //若矩阵发生移动则在空位生成数字
    game = arr; //将移动的矩阵赋给全局game
    showGame(arr);
    return arr;
}

/**
 * 右移 
 * 原理：同左移算法 
 * */
export function pushRight() {
    var arr = game;
    var isMove = 0;
    for (var i = 0; i < arr.length; i++) {
        for (var j = arr.length - 1; j > 0; j--) {
            for (var k = j - 1; k >= 0; k--) {
                if (arr[i][j] == 0 && arr[i][k] != 0) {
                    arr[i][j] ^= arr[i][k];
                    arr[i][k] ^= arr[i][j];
                    arr[i][j] ^= arr[i][k];
                    isMove = 1;
                }
            }
        }
        //从右侧开始向左加
        for (var l = arr.length - 1; l > 0; l--) {
            if (arr[i][l] == arr[i][l - 1]) {
                arr[i][l] += arr[i][l - 1];
                for (var n = l - 1; n > 0; n--) {//左侧数往右补空
                    arr[i][n] = arr[i][n - 1];
                }
                arr[i][0] = 0;
                isMove = 1;
            }
        }
    }
    if (isMove) setEmptyNum();
    game = arr;
    showGame(arr);
    return arr;
}
/**
 * 上移 同理左移算法
 */
export function pushUp() {
    var arr = game;
    var isMove = 0;
    for (var j = 0; j < arr.length; j++) {
        for (var i = 0; i < arr.length; i++) {
            for (var k = i + 1; k < arr.length; k++) {
                if (arr[i][j] == 0 && arr[k][j] != 0) {
                    arr[i][j] ^= arr[k][j];
                    arr[k][j] ^= arr[i][j];
                    arr[i][j] ^= arr[k][j];
                    isMove = 1;
                }
            }
        }
        //同数相加
        for (var l = 0; l < arr.length - 1; l++) {
            if (arr[l][j] == arr[l + 1][j]) {
                arr[l][j] += arr[l + 1][j];
                for (var n = l + 1; n < arr.length - 1; n++) {//后面的数字向前补空
                    arr[n][j] = arr[n + 1][j];
                }
                arr[arr.length - 1][j] = 0;//最后一位补0
                isMove = 1;
            }
        }
    }
    if (isMove) setEmptyNum();
    game = arr;
    showGame(arr);
    return arr;
}
/**
 * 下移 同理左移算法
 */
export function pushDown() {
    var arr = game;
    var isMove = 0;
    for (var j = 0; j < arr.length; j++) {
        for (var i = arr.length - 1; i > 0; i--) {
            for (var k = i - 1; k >= 0; k--) {
                if (arr[i][j] == 0 && arr[k][j] != 0) {
                    arr[i][j] ^= arr[k][j];
                    arr[k][j] ^= arr[i][j];
                    arr[i][j] ^= arr[k][j];
                    isMove = 1;
                }
            }
        }
        for (var l = arr.length - 1; l > 0; l--) {
            if (arr[l][j] == arr[l - 1][j]) {
                arr[l][j] += arr[l - 1][j];
                for (var n = l - 1; n > 0; n--) { //上面的数字往下移动一格
                    arr[n][j] = arr[n - 1][j];
                }
                arr[0][j] = 0;
                isMove = 1;
            }
        }
    }
    if (isMove) setEmptyNum();
    showGame(arr);
    game = arr;
    return arr;
}
/** 
 * 空位随机生成数字
 * */
function setEmptyNum() {
    var temparr = [];//矩阵空位的坐标
    for (var i = 0; i < game.length; i++) {
        for (var j = 0; j < game.length; j++) {
            if (game[i][j] == 0) {
                temparr.push(i + ":" + j);//为0的坐标传入temparr
            }
        }
    }
    if (temparr.length != 0) {  //空位不为0
        var rX = parseInt(Math.random() * temparr.length);
        var x = temparr[rX].split(":")[0];
        var y = temparr[rX].split(":")[1];
        game[x][y] = rdNum[parseInt(Math.random() * rdNum.length)];//自动生成数字填入
    }
    isGameOver();
}

/** 判断游戏是否结束 */
function isGameOver() {
    var sumScore = 0; //总分
    //判断所有相邻位置没有相同的数  
    G1: for (var i = 0; i < game.length; i++) {
        for (var j = 0; j < game.length - 1; j++) {
            var isOver = 1; //游戏结束判断标识符，默认结束
            if (game[i][j] == game[i][j + 1] || game[j][i] == game[j + 1][i]) {
                isOver = 0; //游戏还能继续，取消结束状态
                break G1;
            } else if (game[i][j] == 0) {
                isOver = 0; //游戏还能继续，取消结束状态
                break G1;
            }
            sumScore += game[i][j];//矩阵所有数据求和
        }
    }
    if (isOver) alert("2048 End!Your Score:" + sumScore);
}
/**
 * 输出显示阵列
 * */
function showGame(arr) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
            if (arr[i][j] == 0) {
                $(".numCube").eq(i * arr.length + j).css("color", "bisque");
            } else {
                $(".numCube").eq(i * arr.length + j).css("color", "cornflowerblue");
            }
            $(".numCube").eq(i * arr.length + j).html(arr[i][j]);//输出到相应前端元素
        }
    }
}
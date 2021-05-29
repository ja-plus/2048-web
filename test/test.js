import Game from '../js/gameCore.js';

let arr = [
  [0, 2, 4, 2],
  [0, 2, 0, 4],
  [2, 2, 8, 4],
  [2, 4, 0, 4],
  // [4, 0, 0, 4],
  // [4, 4, 2, 0],
  // [0, 0, 2, 0],
];
let game = new Game(arr);
// arr.forEach(item => {
//   arrLeft(item)
// });
console.log(game.pushLeft());
print();
console.log(game.pushLeft());
// game.pushRight();
// print();
// game.pushUp();
// print();
// game.pushDown();
// print();
// game.switchXY();
// print();

function print(){
  game.GAME.forEach(it => {
    console.log(it);
  })
  console.log('---------------');
}

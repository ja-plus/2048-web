// import {gameStart, pushDown, pushLeft, pushRight, pushUp} from './2048-core.js';
import GameCore from './gameCore.js'
window.onload=function(){
    // alert("mission start!");
    // gameStart();//初始化游戏
    let game =  new GameCore(); 
    game.showGame();
    keyAction(game);//初始化键盘响应事件
};
/**键盘响应事件 */
function keyAction(game){
    document.onkeydown = function(event){
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if(e.keyCode == 37){
            game.control('left');
        }
        if(e.keyCode == 38){
            game.control('up');
            // pushUp();
        }
        if(e.keyCode == 39){
            game.control('right');
            // pushRight();
        }
        if(e.keyCode == 40){
            game.control('down');
            // pushDown();
        }
    }
}
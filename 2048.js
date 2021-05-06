import GameCore from './gameCore.js'
window.onload=function(){
    // alert("mission start!");
    let game =  new GameCore(); 
    keyAction(game);//初始化键盘响应事件
    touchAction(game);
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
        }
        if(e.keyCode == 39){
            game.control('right');
        }
        if(e.keyCode == 40){
            game.control('down');
        }
    }
}
function touchAction(game){
    let touchStart = {};
    document.body.addEventListener('touchstart', (e) => {
        // console.log(e,'event');
        touchStart = e.changedTouches[0];
    })
    document.body.addEventListener('touchend', (e) => {
        // console.log(e,'touchend');
        let endX = e.changedTouches[0].screenX;
        let endY = e.changedTouches[0].screenY;
        let xOffset = endX - touchStart.screenX;
        let yOffset = endY - touchStart.screenY;
        if(Math.abs(xOffset) > Math.abs(yOffset)){ // 横向移动
            if(xOffset > 0 ){ // 右移
                game.control('right');
            }else { //左移
                game.control('left');
            }
        }else { // 纵向移动
            if(yOffset > 0 ){ // 下移
                game.control('down');
            }else { //上移
                game.control('up');
            }

        }

    })
}
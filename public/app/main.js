var BLOCK_SIZE = 32;
var WIDTH = 800;
var HEIGHT = 576;
window.game = new Phaser.Game(WIDTH,HEIGHT,Phaser.CANVAS, 'phaserGame');

startGame();

function startGame(){

    game.state.add('Preload',require('./model/preloader'));
    game.state.add('Arena',require('./model/arena'));
    game.state.start('Preload');

    /*socket = io("http://localhost:3000");
    require('./game/mods/phaser_enhancements');
    game.state.add("Boot", require("./game/logic/boot"));
    game.state.add("Lobby", require("./game/logic/lobby"));

    game.state.start('Boot');*/
}
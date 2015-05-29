var Preloader = function(){};

module.exports = Preloader;

Preloader.prototype = {
    preload: function(){
        game.load.spritesheet('bomberman_white','./app/resource/bomberman.png',32,64);
        game.load.spritesheet('bomberman_purple','./app/resource/bomberman2.png',32,64);
        game.load.spritesheet('bomb','./app/resource/bomb.png',32,32);
        game.load.image('grass','./app/resource/BackgroundTile.png');
        game.load.image('finalBlock','./app/resource/SolidBlock.png');
        game.load.image('expBlock','./app/resource/ExplodableBlock.png');
        game.load.image('bomberman','./app/resource/Bman_F_f00.png');
        game.load.image('bomb','./app/resource/Bomb_f01.png');
        game.load.image('lobby_backdrop','./app/resource/lobby_backdrop.png');
        game.load.image('background','./app/resource/background.png');
        game.load.image('game_slot','./app/resource/game_slot.png');
    },
    create: function(){
        socket.emit('start game');
        socket.on('start game', function(data){
            game.state.start('Arena',true, false, data.players, data.id, data.maps);
        });
    }
};

var Maps = require("../entity/maps");
var Player = require("../entity/player");
var Arena = function(){};

module.exports = Arena;


var BLOCK_SIZE = 32;
var WIDTH = 800;
var HEIGHT = 576;


Maps.create(Math.round(WIDTH / BLOCK_SIZE),Math.round(HEIGHT / BLOCK_SIZE));
Maps.generate();
//Maps.print();
console.log(Math.round(game.height)+'x'+Math.round(game.width));
var map = Maps.getMap();

Arena.prototype = {
    gmap: null,
    spaceButton: null,
    gameFrozen: false,
    create: function(){
        game.physics.startSystem(Phaser.Physics.ARCADE);
        gmap = game.add.tilemap();
        gmap.addTilesetImage('grass', 'grass', 32, 32, null, null, 0);
        gmap.addTilesetImage('finalBlock', 'finalBlock', 32, 32, null, null, 1);
        gmap.addTilesetImage('expBlock', 'expBlock', 32, 32, null, null, 2);
        layer = gmap.create('layer',Maps.getWidth(),Maps.getHeight(),32,32);
        layer.resizeWorld();
        gmap.setCollision([1,2]);
        for(var i=0; i < Maps.getWidth(); i++){
            for(var j = 0; j < Maps.getHeight(); j++){
                gmap.putTile(map[i][j],i,j,layer);
            }
        }
        this.initializePlayers();
    },
    update: function() {
        if(player != null){
            if(this.gameFrozen){
                player.freeze();
            }
            else{
                player.handleInput();
            }
        }
    },
    initializePlayers: function(){
        player = new Player(32,64,0,'purple');
    }
};

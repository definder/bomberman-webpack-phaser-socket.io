var Player = require("../entity/player");
var RemotePlayer = require("../entity/remotePlayer");
var Arena = function(){};

module.exports = Arena;

Arena.prototype = {
    gmap: null,
    spaceButton: null,
    gameFrozen: false,
    player: {},
    remotePlayers: {},
    init: function(players, id, map){
        this.players = players;
        this.playerID = id;
        this.maps = map;
    },
    setEventHandler: function(){
        socket.on('move player', this.onMovePlayer());
    },
    create: function(){
        game.physics.startSystem(Phaser.Physics.ARCADE);
        gmap = game.add.tilemap();
        gmap.addTilesetImage('grass', 'grass', 32, 32, null, null, 0);
        gmap.addTilesetImage('finalBlock', 'finalBlock', 32, 32, null, null, 1);
        gmap.addTilesetImage('expBlock', 'expBlock', 32, 32, null, null, 2);
        layer = gmap.create('layer',this.maps.getWidth(),this.maps.getHeight(),32,32);
        layer.resizeWorld();
        gmap.setCollision([1,2]);
        this.setEventHandler();
        for(var i=0; i < this.maps.getWidth(); i++){
            for(var j = 0; j < this.maps.getHeight(); j++){
                gmap.putTile(this.maps[i][j],i,j,layer);
            }
        }
        this.initializePlayers();
    },
    update: function() {
        if(this.player != null){
            if(this.gameFrozen){
                this.player.freeze();
            }
            else{
                this.player.handleInput();
            }
        }
        for(var i in this.remotePlayers){
            this.remotePlayers[i].interpolate();
        }
    },
    initializePlayers: function(){
        for(var i in this.players){
            var data = this.players[i];
                if(data.id == this.playerID){
                    this.player = new Player(data.x,data.y,data.facing,data.color);
                }
                else{
                    this.remotePlayers[data.id] = new RemotePlayer(data.x,data.y,data.facing,data.color);
                }
        }

    },
    onMovePlayer: function(data){
        if(this.player && this.playerID == data.id){
            return;
        }
        var movePlayer = this.remotePlayers[data.id];
        if(movePlayer.x == data.x && movePlayer.y == data.y){
            return;
        }
        movePlayer.animations.play(movePlayer.facing);
        movePlayer.previousPosition = {x: movePlayer.x, y: movePlayer.y};
    }
};

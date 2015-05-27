var Player = require('./entity/player');

var str = 'abcdefghijklmnopqrstuvwxyz0123456789';

var PendingGame = function(){
    this.players = {};
    this.playerInf = [
        {x: 1, y: 1, facing: 'down', color: 'white', free: true},
        {x: 17, y: 1, facing: 'down', color: 'purple', free: true},
        {x: 17, y: 17, facing: 'down', color: 'green', free: true},
        {x: 1, y: 17, facing: 'down', color: 'yellow', free: true}
    ];
    this.gameID = null;
};
PendingGame.prototype = {
    getGameID: function(){
        if(this.gameID == null){
            var s = "";
            while(s.length < 10){
                s += str[Math.random()*str.length|0];
            }
            this.gameID = s;
            return this.gameID;
        }
        else
            return this.gameID;
    },
    getPlayersIds: function(){
        return Object.keys(this.players);
    },
    getPlayerToID: function(id){
        return this.players[id];
    },
    getCountPlayers: function(){
        return Object.keys(this.players).length;
    },
    removePlayers: function(id){
        delete this.players[id];
    },
    getOccupiedSlots: function(){
        var slots =[];
        var tmp = this.players;
        Object.keys(this.players).forEach(function(item, i){
            slots.push(tmp[item].slot);
        });
        return slots;
    },
    addPlayer: function(id,slot){
        var result = true;
        Object.keys(this.players).forEach(function(item){
            if(item == id){
                result = false;
            }
        });
        if(result){
            var player = this.playerInf[slot-1];
            this.players[id] = new Player(player.x, player.y, player.facing, id, player.color,slot);
            this.playerInf[slot-1].free = false;
        }
        else{
            return false;
        }
    }
};

module.exports = PendingGame;
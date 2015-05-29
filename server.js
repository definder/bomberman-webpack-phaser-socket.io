var express = require('express'),
    path = require('path'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io')(server),
    port = 3000,
    fs = require('fs');
server.listen(port);


app.use(express.static(path.join( __dirname, 'public')));

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

app.get('/game', function (req, res) {
    fs.readFile('./public/game.html', function(err, data){
        res.write(data);
        res.end();
    })
});

var PendingGame = require('./pending_game');
var Game = require('./entity/game');
var Maps = require('./entity/maps');
var pendingGame = new PendingGame();
var isGame = false;
var statGame = null;
var games = {};


var BLOCK_SIZE = 32;
var WIDTH = 800;
var HEIGHT = 576;



init();

function init(){
    setEvent();
}
function setEvent(){
    io.on('connection', function(socket){
        console.info("New player has connected: "+socket.id+"/"+socket.handshake.address);
        socket.on('add to lobby', onEnterLobby);
        socket.on('view stat', function(){
            if(statGame == null){
                statGame = setInterval(function(){
                    information();
                },1000);
            }
        });
        socket.on('start game', onStartGame);
        socket.on('move player', onMovePlayer);
        socket.on('start arena', function(){
            io.to(pendingGame.getGameID()).emit('start_arena');
            console.log('START');
        });
    });
}
function onEnterLobby(data){
    if(pendingGame.addPlayer(this.id,data.slot)){
        this.join(pendingGame.getGameID());
        io.to(pendingGame.getGameID()).emit('you enter lobby', {slot: pendingGame.getPlayerToID(this.id).slot});
    }
}
function onStartGame(){
    clearInterval(statGame);
    Maps.create(Math.round(WIDTH / BLOCK_SIZE),Math.round(HEIGHT / BLOCK_SIZE));
    Maps.generate();
    io.to(pendingGame.getGameID()).emit('start game', {players: pendingGame.players, id: this.id, maps: Maps});
}
function onMovePlayer(data){
    io.to(pendingGame.getGameID()).emit('move player', {x: data.x, y: data.y, facing: data.facing});
}
function information(){
    io.emit('information', {counts: pendingGame.getCountPlayers(), slots:pendingGame.getOccupiedSlots()});
}

var Lobby = {

};

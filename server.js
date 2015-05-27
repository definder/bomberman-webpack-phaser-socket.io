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
var pendingGame = new PendingGame();
var isGame = false;
var statGame = null;
var games = {};

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
        socket.on('view stat concel', function(){
            clearInterval(statGame);
        });
    });
}
function onEnterLobby(data){
    if(pendingGame.addPlayer(this.id,data.slot)){
        this.join(pendingGame.getGameID());
        io.to(pendingGame.getGameID()).emit('you enter lobby', {slot: pendingGame.getPlayerToID(this.id).slot});
    }
}
function information(){
    io.emit('information', {counts: pendingGame.getCountPlayers(), slots:pendingGame.getOccupiedSlots()});
}
var lobbySlots =[];

var Lobby = {

};

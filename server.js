var express = require('express'),
    path = require('path'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io')(server),
    port = 3000,
    fs = require('fs'),
    logger = require('socket.io-logger')();
server.listen(port);
var stream = fs.createWriteStream('./events.log', {flags:'a'});
logger.stream(stream);
io.use(logger);


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

var Player = require('./entity/player');

var games = {};

init();

function init(){
    setEvent();
}
function setEvent(){
    io.on('connection', function(socket){
        console.info("New player has connected: "+socket.id);
        socket.on('eventServer', function (data) {
            console.log(data);
            socket.emit('eventClient', { data: 'Hello Client' });
        });
        socket.emit('eventClient', { data: 'Hello Client' });
        socket.on('disconnect', function () {
            console.log('user disconnected');
        });
    });
}

var lobbySlots =[];

var Lobby = {
    onEnterLobby: function(data){
        this.join('lobby');
        socket.in('lobby').emit('you enter lobby', {you: 'ENTER'});
    }
};

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

init();

function init(){
    setEvent();
}
function setEvent(){
    io.on('connection', function(socket){
        console.log("New player has connected: "+socket.id);
        socket.emit('news', { hello: 'world' });
        socket.on('my other event', function (data) {
            console.log(data);
        });
    });
}



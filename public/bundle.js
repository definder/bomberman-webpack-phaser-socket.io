/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	window.socket = null;
	var socket = io.connect();
	var BLOCK_SIZE = 32;
	var WIDTH = 800;
	var HEIGHT = 576;
	window.game = new Phaser.Game(WIDTH,HEIGHT,Phaser.CANVAS, 'phaserGame');

	socket.on('start_arena',startGame());

	function startGame(){
	    console.log('START ARENAAAAA');
	    game.state.add('Preload',__webpack_require__(1));
	    game.state.add('Arena',__webpack_require__(2));
	    game.state.start('Preload');

	    /*socket = io("http://localhost:3000");
	    require('./game/mods/phaser_enhancements');
	    game.state.add("Boot", require("./game/logic/boot"));
	    game.state.add("Lobby", require("./game/logic/lobby"));

	    game.state.start('Boot');*/
	}

	/* Style start */
	$(document).ready(function() {
	    var infoBlock = document.getElementById('information');
	    infoBlock.innerHTML = '<h4 style="text-align: center">Welcome to the game Bomberman!</h4><br>';
	    $('.button-info').click(function () {
	        if ($(this).hasClass('active')) {
	            $('#information').css({'display': 'none'});
	            $(this).removeClass('active');
	        }
	        else {
	            $('#information').css({'display': 'block'});
	            $(this).addClass('active');
	        }
	    });
	    $('#start-game').click(function(){
	        if($('#body').hasClass('display-block')){
	            $('#body').removeClass('display-block');
	            $('#body').addClass('display-none');
	        }
	        if($('#arena').hasClass('display-none')){
	            $('#arena').removeClass('display-none');
	        }
	        socket.emit('start_arena');
	    });
	    $('.slot_1 a').click(function(){
	        socket.emit('add to lobby', { slot: 1 });
	    });
	    $('.slot_2 a').click(function(){
	        socket.emit('add to lobby', { slot: 2 });
	    });
	    $('.slot_3 a').click(function(){
	        socket.emit('add to lobby', { slot: 3 });
	    });
	    $('.slot_4 a').click(function(){
	        socket.emit('add to lobby', { slot: 4 });
	    });
	});
	/* Style end */

	socket.emit('view stat');

	socket.on('you enter lobby', function(data){
	    $('.slot_'+data.slot+' a').addClass('display-none');
	    $('.slot_'+data.slot+' .ico_'+data.slot).addClass('display-flex');
	    var infoBlock = document.getElementById('information');
	    var text = '<p>Slot '+data.slot+' - redy to Play!!</p><br>';
	    infoBlock.innerHTML += text;
	});

	socket.on('information', function(data) {
	    var infoBlock = document.getElementById('information');
	    var text = '';
	    if(data.counts != 0){
	        for(var i = 0; i < data.counts; i++){
	            if(!$('.slot_'+data.slots[i]+' a').hasClass('display-none')){
	                text = '<p>Slot '+data.slots[i]+' - redy to Play!!</p><br>';
	                $('.slot_'+data.slots[i]+' a').addClass('display-none');
	            }
	            if(!$('.slot_'+data.slots[i]+' .ico_'+data.slots[i]).hasClass('display-flex')){
	                $('.slot_'+data.slots[i]+' .ico_'+data.slots[i]).addClass('display-flex');
	            }
	        }
	    }
	    infoBlock.innerHTML += text;
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Player = __webpack_require__(3);
	var RemotePlayer = __webpack_require__(4);
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


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var DEFAULT_SPEED = 150;
	var POWERUP_SPEED = 60;

	var Player = function(x, y, id, color){
	    Phaser.Sprite.call(this, game, x, y, "bomberman_" + color);

	    this.id = id;
	    this.speed = DEFAULT_SPEED;
	    this.facing = 'down';

	    game.physics.enable(this, Phaser.Physics.ARCADE);
	    this.anchor.setTo(0.1,0.6);
	    this.body.setSize(20, 19, 5, 16);
	    /*this.body.setSize(23, 20, 5, 16);*/
	    this.animations.add('up', [0,1,2,3,4,5,6,7], 15, true);
	    this.animations.add('down', [8,9,10,11,12,13,14,15], 15, true);
	    this.animations.add('right', [16,17,18,19,20,21,22,23], 15, true);
	    this.animations.add('left', [24,25,26,27,28,29,30,31], 15, true);
	    game.add.existing(this);
	};

	Player.prototype = Object.create(Phaser.Sprite.prototype);

	Player.prototype.handleInput = function(){
	    this.handleMotionInput();
	};

	Player.prototype.handleMotionInput = function(){
	    var moving = true;
	    game.physics.arcade.collide(this, layer);
	    if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
	        this.body.velocity.y = 0;
	        this.body.velocity.x = -this.speed;
	        this.facing = "left";
	    } else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
	        this.body.velocity.y = 0;
	        this.body.velocity.x = this.speed;
	        this.facing = "right";
	    } else if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
	        this.body.velocity.x = 0;
	        this.body.velocity.y = -this.speed;
	        this.facing = "up";
	    } else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
	        this.body.velocity.x = 0;
	        this.body.velocity.y = this.speed;
	        this.facing = "down";
	    } else {
	        moving = false;
	        this.freeze();
	    }
	    if(moving){
	        this.animations.play(this.facing);
	        socket.emit("move player", {x: this.position.x, y: this.position.y, facing: this.facing});
	    }
	};

	Player.prototype.handleBombInput = function(){
	    /*if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) &&)*/
	};

	Player.prototype.freeze = function() {
	    this.body.velocity.x = 0;
	    this.body.velocity.y = 0;
	    this.animations.stop();
	};

	module.exports = Player;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var RemotePlayer = function(x, y, id, color){
	    this.id = id;
	    this.previousPosition = {x: x, y: y};
	    Phaser.Sprite.call(this, game, x, y, "bomberman_" + color);
	    game.physics.enable(this, Phaser.Physics.ARCADE);
	    this.anchor.setTo(0.1,0.6);
	    this.body.setSize(20, 19, 5, 16);
	    this.animations.add('up', [0,1,2,3,4,5,6,7], 15, true);
	    this.animations.add('down', [8,9,10,11,12,13,14,15], 15, true);
	    this.animations.add('right', [16,17,18,19,20,21,22,23], 15, true);
	    this.animations.add('left', [24,25,26,27,28,29,30,31], 15, true);
	    game.add.existing(this);
	};

	RemotePlayer.prototype = Object.create(Phaser.Sprite.prototype);

	RemotePlayer.prototype.interpolate = function(){
	    this.position.x = this.previousPosition.x;
	    this.position.y = this.previousPosition.y;
	};


/***/ }
/******/ ]);
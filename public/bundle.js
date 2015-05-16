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

	var BLOCK_SIZE = 32;
	var WIDTH = 800;
	var HEIGHT = 576;
	window.game = new Phaser.Game(WIDTH,HEIGHT,Phaser.CANVAS, 'phaserGame');

	startGame();

	function startGame(){

	    game.state.add('Preload',__webpack_require__(1));
	    game.state.add('Arena',__webpack_require__(2));
	    game.state.start('Preload');

	    /*socket = io("http://localhost:3000");
	    require('./game/mods/phaser_enhancements');
	    game.state.add("Boot", require("./game/logic/boot"));
	    game.state.add("Lobby", require("./game/logic/lobby"));

	    game.state.start('Boot');*/
	}

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
	        game.state.start('Arena');
	    }
	};


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Maps = __webpack_require__(3);
	var Player = __webpack_require__(4);
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


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var Maps = {
	    map: null,
	    map_size_height: null,
	    map_size_width: null,
	    rooms: [],
	    stats: null,
	    tree: [],
	    stack: [],
	    gid: 1,
	    minRoomSize: 5,
	    minSizeFactor: 0.3,

	    clear: function(){
	        this.map = [];
	        this.map_size_height = null;
	        this.map_size_width = null;
	        this.rooms = [];
	        this.stats = {};
	        this.tree = [];
	        this.stack = [];
	        this.gid = 1;
	    },
	    create: function(width,height){
	        this.clear();
	        this.map_size_height = height;
	        this.map_size_width = width;
	        for (var x = 0; x < this.map_size_width; x++) {
	            this.map[x] = [];
	            for (var y = 0; y < this.map_size_height; y++) {
	                this.map[x][y] = 0;
	            }
	        }
	        for(var x = 0; x < this.map_size_width; x++){
	            for (var y = 0; y < this.map_size_height; y++) {
	                if((x == 0 || x == this.map_size_width-1)||(y == 0 || y == this.map_size_height-1)){
	                    this.map[x][y] = 1;
	                }
	            }
	        }
	    },
	    generate: function(){
	        var randArray = [];
	        for (var x = 1; x < this.map_size_width-1; x++) {
	            for(var r = 0; r < this.map_size_width-7; r++){
	                randArray[r] = Math.round(Math.random()*(this.map_size_width-2)+1);
	            }
	            for (var y = 1; y < this.map_size_height-1; y++) {
	                if(isArray(randArray,y)){
	                    this.map[x][y] = 2;
	                }
	            }
	        }
	        this.map[1][1] = 0;
	        this.map[1][2] = 0;
	        this.map[2][1] = 0;
	        this.map[23][1] = 0;
	        this.map[22][1] = 0;
	        this.map[23][2] = 0;
	        this.map[1][16] = 0;
	        this.map[1][15] = 0;
	        this.map[2][16] = 0;
	        this.map[23][16] = 0;
	        this.map[22][16] = 0;
	        this.map[23][15] = 0;
	    },
	    print: function(){
	        console.log('BOMDERMAN');
	        console.log(this.map_size_width+'x'+this.map_size_height);
	        for(var x = 0; x < this.map_size_width; x++){
	            var row = x;
	            if(x < 10){
	                row+='  ';
	            }
	            else{
	                row+= ' ';
	            }
	            for(var y = 0; y < this.map_size_height; y++){
	                row += this.map[x][y] + ' ';
	            }
	            console.debug(row);
	        }
	    },
	    getMap: function(){
	        return this.map;
	    },
	    getWidth: function(){
	        return this.map_size_width;
	    },
	    getHeight: function(){
	        return this.map_size_height;
	    },
	    setMap: function(){
	        this.map[5][5] = 2;
	    }
	};
	function isArray (array, value){
	    for(var i = 0; i < array.length; i++){
	        if(array[i] == value){
	            return true;
	        }
	    }
	    return false;
	}

	module.exports = Maps;



/***/ },
/* 4 */
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


/***/ }
/******/ ]);
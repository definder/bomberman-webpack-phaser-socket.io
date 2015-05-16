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

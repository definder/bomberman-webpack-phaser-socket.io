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

var Player = function(xSpawn, ySpawn, facing, id, color){
    this.xSpawn = xSpawn;
    this.ySpawn = ySpawn;
    this.x = xSpawn;
    this.y = ySpawn;
    this.facing = facing;
    this.id = id;
    this.color = color;
    this.wins = 0;
};

module.exports = Player;

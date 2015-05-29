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


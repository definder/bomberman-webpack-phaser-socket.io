var StageSelect = function() {};

module.exports = StageSelect;

var xOffset = 180;
var yOffset = 25;
var thumbnailXOffset = 396;
var thumbnailYOffset = 125;
var stageNameYOffset = 320;
var repeatingBombTilesprite;

var stages = [
    {name: "Comeback", thumbnailKey: "first_", tilemapName: "First", maxPlayers: 4, size: "medium"},
	{name: "Danger Desert", thumbnailKey: "danger_desert_thumbnail", tilemapName: "levelTwo", maxPlayers: 4, size: "medium"}
];

StageSelect.prototype = {
    init: function (gameId) {
		this.gameId = gameId;
	},

	create: function() {
        game.add.sprite(0, 0, 'background_s');
		var selectionWindow = game.add.image(xOffset, yOffset, "select_stage");
		this.selectedStageIndex = 0;
		var initialStage = stages[this.selectedStageIndex];
        this.leftButton = game.add.button(300, 155, "left_select_button", this.leftSelect, this, 1, 0);
        this.rightButton = game.add.button(530, 155, "right_select_button", this.rightSelect, this, 1, 0);
        this.okButton = game.add.button(625, 425, "ok_button", this.confirmStageSelection, this, 1, 0);
		this.thumbnail = game.add.image(thumbnailXOffset, thumbnailYOffset, initialStage.thumbnailKey);
		this.text = game.add.text(game.camera.width / 2, stageNameYOffset, initialStage.name);
		this.configureText(this.text, "white", 28);
		this.text.anchor.setTo(.5, .5);
        this.numPlayersText = game.add.text(360, 380, "Max # of players:   " + initialStage.maxPlayers);
		this.configureText(this.numPlayersText, "white", 18);
        this.stageSizeText = game.add.text(360, 410, "Map size:   " + initialStage.size);
		this.configureText(this.stageSizeText, "white", 18);
	},

	leftSelect: function() {
		if(this.selectedStageIndex === 0) {
			this.selectedStageIndex = stages.length - 1;
		} else {
			this.selectedStageIndex--;
		}

		this.updateStageInfo();
	},

	rightSelect: function() {
		if(this.selectedStageIndex === stages.length - 1) {
			this.selectedStageIndex = 0;
		} else {
			this.selectedStageIndex++;
		}

		this.updateStageInfo();
	},

	update: function() {
	},

	updateStageInfo: function() {
		var newStage = stages[this.selectedStageIndex];
		this.text.setText(newStage.name);
		this.numPlayersText.setText("Max # of players:   " + newStage.maxPlayers);
		this.stageSizeText.setText("Map size:   " + newStage.size);
		this.thumbnail.loadTexture(newStage.thumbnailKey);
	},

	configureText: function(text, color, size) {
		text.font = "Carter One";
		text.fill = color;
		text.fontSize = size;
	},

	confirmStageSelection: function() {
		var selectedStage = stages[this.selectedStageIndex];

		socket.emit("select stage", {mapName: selectedStage.tilemapName});
        game.state.start("PendingGame", true, false, selectedStage.tilemapName, this.gameId);
	}
};
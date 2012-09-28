// Set up the global state

function Game() {
	var board = [];
	for (var i = 0; i < 22; i++) {
		var row = [];
		for (var j = 0; j < 10; j++) {
			row.push("#F00");
		}
		board.push(row);
	}
	var draw = function(canvas) {
		var width = canvas.width;
		var height = canvas.height;
		var bwidth = width / 10;
		var bheight = height / 22;
		var ctx = canvas.getContext("2d");
		board.forEach(function(row, i) {
			row.forEach(function(cell, j) {
				ctx.fillStyle = cell;
				// We do a 1 px margin on each side
				var margin = 1;
				var x = j * bwidth + margin;
				var y = i * bheight + margin
				var w = bwidth - margin;
				var h = bheight - margin;
				ctx.fillRect(x, y, w, h);
			});
		});
	};

	this.board = board;
	this.draw = draw;
}


var game = new Game();

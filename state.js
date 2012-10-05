// Set up the global state
define('state', ['piece'], function(Piece) {
	function Game(canvas) {
		var board = [];
		canvas.width = 300;
		canvas.height = 660;
		var width = canvas.width;
		var height = canvas.height;
		var gwidth = 10;
		var gheight = 22;
		for (var i = 0; i < gheight; i++) {
			var row = [];
			for (var j = 0; j < gwidth; j++) {
				row.push("#FFF");
			}
			board.push(row);
		}
		var px = 0;
		var py = 0;

		var draw = function() {
			var bwidth = width / gwidth;
			var bheight = height / gheight;
			var margin = 1;
			var ctx = canvas.getContext("2d");
			board.forEach(function(row, i) {
				row.forEach(function(cell, j) {
					ctx.fillStyle = cell;
					// We do a 1 px margin on each side
					var x = j * bwidth + margin;
					var y = i * bheight + margin
					var w = bwidth - margin;
					var h = bheight - margin;
					ctx.fillRect(x, y, w, h);
				});
			});

			// Don't do any collision detection here, just draw it
			Piece.piece().forEach(function(row, i) {
				row.forEach(function(cell, j) {
					// This is dumb, don't do this
					if (cell != '#FFF') {
						ctx.fillStyle = cell;
						var x = (px + j) * bwidth + margin;
						var y = (py + i) * bheight + margin;
						var w = bwidth - margin;
						var h = bheight - margin;
						ctx.fillRect(x, y, w, h);
					}
				});
			});
		};

		// How far can each of the columns of the current piece go, relative to py?
		var current_heights = [];
		var update = function() {
			// update piece position
			py += 1;
			var place;
			if (coliding()) {
				py -= 1;
				place = true;
			}
			place = place || py + Piece.piece().length >= gheight;
			if (place) {
				Piece.piece().forEach(function(row, i) {
					row.forEach(function(cell, j) {
						if (cell != '#FFF') {
							var y = py + i;
							var x = px + j;
							board[y][x] = cell;
						}
					});
				});
				py = 0;
				Piece.pick_piece(px, gwidth);
			}
		};

		var coliding = function() {
			var coliding = false;
			Piece.piece().forEach(function(row, i) {
				row.forEach(function(cell, j) {
					if (cell != '#FFF' && board[py + i][px + j] != '#FFF') {
						coliding = true;
						return coliding;
					}
				});
			});
			return coliding;
		};
					
		var move_right = function() {
			if (px + 1 + Piece.piece()[0].length < gwidth) {
				px += 1;
			}
			if (coliding()) {
				px -= 1;
			}
			draw();
		};
		var move_left = function() {
			if (px > 0) {
				px -= 1;
			}
			if (coliding()) {
				py -= 1;
			}
			draw();
		};

		var rotate = function() {
			Piece.rotate();
			if (px + Piece.piece()[0].length >= gwidth) {
				px--;
			}
		};

		this.board = board;
		this.draw = draw;
		this.update = update;
		this.move_right = move_right;
		this.move_left = move_left;
		this.rotate = Piece.rotate;
	}
	return {Game: Game};
});

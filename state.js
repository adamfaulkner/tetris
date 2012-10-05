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
		var widths = [];
		for (var i = 0; i < gheight; i++) {
			var row = [];
			for (var j = 0; j < gwidth; j++) {
				row.push("#FFF");
			}
			board.push(row);
			widths.push(0);
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

			if (py + Piece.piece().length > gheight) {
				place = true;
				py -= 1;
			}

			if (coliding()) {
				py -= 1;
				place = true;
			}

			if (place) {
				Piece.piece().forEach(function(row, i) {
					row.forEach(function(cell, j) {
						if (cell != '#FFF') {
							var y = py + i;
							var x = px + j;
							board[y][x] = cell;
							// Row clearing logic
							widths[y]++;
						}
					});
				});
				py = 0;
				px = Piece.pick_piece(px, gwidth);
			}
			clear_rows();
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
			if (px + Piece.piece()[0].length < gwidth) {
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
			var old_px = px;
			Piece.rotate();
			if (px + Piece.piece()[0].length >= gwidth) {
				px--;
			}
			if (coliding()) {
				px = old_px;
				Piece.rotate();
				Piece.rotate();
				Piece.rotate();
			}
			draw();
		};

		var new_row = function() {
			var row = [];
			for (var i = 0; i < gwidth; i++) {
				row.push('#FFF');
			}
			return row;
		};

		var clear_rows = function() {
			// Look through widths, see if we should clear anything.
			var shift = 0;
			// go bottom up to avoid extra work
			for (var i = widths.length - 1; i >= 0; i--) {
				if (widths[i] >= gwidth) {
					shift++;
				}
				if (shift) {
					if (i - shift >= 0) {
						board[i] = board[i - shift];
						widths[i] = widths[i - shift];
					} else {
						board[i] = new_row();
						widths[i] = 0;
					}
				}
			}
		};
				
		this.board = board;
		this.draw = draw;
		this.update = update;
		this.move_right = move_right;
		this.move_left = move_left;
		this.rotate = rotate;
	}
	return {Game: Game};
});

// Set up the global state
define('state', ['piece', 'config'], function(Piece, config) {
	function Game(canvas) {
		var board = [];
		var px = 0;
		var py = 0;
		var lost = false;
		canvas.width = 150;
		canvas.height = 330;
		config.width = canvas.width;
		config.height = canvas.height;
		px = Piece.pick_piece(config.gwidth, px);
		var widths = [];
		var heights = [];
		var i, j;
		// Initialize the board and the widths array
		for (i = 0; i < config.gheight; i++) {
			var row = [];
			for (j = 0; j < config.gwidth; j++) {
				row.push("#FFF");
			}
			board.push(row);
			widths.push(0);
		}
		// Initialize the heights array
		for (j = 0; j < config.gwidth; j++) {
			heights.push(0);
		}

		var place = function() {
			Piece.piece().forEach(function(row, i) {
				row.forEach(function(cell, j) {
					if (cell != '#FFF') {
						if (py + i <= 1) {
							lost = true;
						} else {
							var y = py + i;
							var x = px + j;
							board[y][x] = cell;
							// Row clearing logic
							widths[y]++;
							if (heights[x] < y) {
								heights[x] = y;
							}
						}
					}
				});
			});
			var rows_cleared = clear_rows();
			px = Piece.pick_piece(config.gwidth, px);
			py = 0;
			return rows_cleared;
		};
			
		var update = function() {
			// update piece position
			py++;
			var need_place;

			if (py + Piece.piece().length > config.gheight) {
				need_place = true;
				py--;
			}

			if (coliding()) {
				py--;
				need_place = true;
			}

			if (need_place) {
				var rows_cleared = place();
				return rows_cleared;
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
			if (px + Piece.piece()[0].length < config.gwidth) {
				px++;
			}
			if (coliding()) {
				px--;
			}
		};
		var move_left = function() {
			if (px > 0) {
				px--;
			}
			if (coliding()) {
				px++;
			}
		};

		var rotate = function() {
			var old_px = px;
			Piece.rotate();
			if (px + Piece.piece()[0].length >= config.gwidth) {
				px--;
			}
			if (coliding()) {
				px = old_px;
				Piece.rotate();
				Piece.rotate();
				Piece.rotate();
			}
		};

		var new_row = function() {
			var row = [];
			var i;
			for (i = 0; i < config.gwidth; i++) {
				row.push('#FFF');
			}
			return row;
		};

		var clear_rows = function() {
			// Look through widths, see if we should clear anything.
			// Shift represents the line offset for where the next board will be
			var shift = 0;
			// go bottom up to avoid extra work
			var i;
			for (i = widths.length - 1; i >= 0; i--) {
				while (widths[i - shift] >= config.gwidth) {
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
			return shift;
		};

		// Where will piece p end up if dropped in column x?
		var get_drop_position = function(p, x) {
			// TODO: put all of this stuff on the piece class, make it create less garbage
			// TODO: Further, make all pieces singletons, this will greatly reduce our garbage
			var bottoms = [];
			var piece_height = p.length - 1;
			var i, j, rows_cleared;
			for (j = 0; j < p[0].length; j++) {
				i = piece_height;
				while(p[i][j] == '#FFF' && i >= 0) {
					i--;
				}
				bottoms.push(i);
			}
			for (i = py; i < config.gheight - piece_height; i++) {
				for (j = 0; j < p[0].length; j++) {
					if (board[i + bottoms[j]][x + j] != '#FFF') {
						// We hit something, return the current y coordinate
						return i - 1;
				  }
				}
			}
			// We didn't hit anything
			return config.gheight - piece_height - 1;
		};
			
		var drop = function() {
			py = get_drop_position(Piece.piece(), px);
			var rows_cleared = place();
			return rows_cleared;
		};

		this.board = board;
		this.update = update;
		this.move_right = move_right;
		this.move_left = move_left;
		this.rotate = rotate;
		this.drop = drop;
		this.px = function() {
			return px;
		};
		this.py = function() {
			return py;
		};
		this.lost = function() {
			return lost;
		};
		this.widths = function() {
			return widths;
		};
		this.heights = function() {
			return heights;
		};
	}
	return {Game: Game};
});

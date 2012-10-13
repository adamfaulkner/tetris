// Set up the global state
define('state', ['piece', 'display', 'config'], function(Piece, display, config) {
	function Game(canvas) {
		var board = [];
		canvas.width = 150;
		canvas.height = 330;
		config.width = canvas.width;
		config.height = canvas.height;
		Piece.pick_piece(config.gwidth);
		var widths = [];
		for (var i = 0; i < config.gheight; i++) {
			var row = [];
			for (var j = 0; j < config.gwidth; j++) {
				row.push("#FFF");
			}
			board.push(row);
			widths.push(0);
		}

		var place = function() {
			Piece.piece().forEach(function(row, i) {
				row.forEach(function(cell, j) {
					if (cell != '#FFF') {
						var y = Piece.py() + i;
						var x = Piece.px() + j;
						board[y][x] = cell;
						// Row clearing logic
						widths[y]++;
					}
				});
			});
			Piece.pick_piece(config.gwidth);
			Piece.py(0);
		};
			
		var update = function() {
			// update piece position
			Piece.py(Piece.py() + 1);
			var need_place;

			if (Piece.py + Piece.piece().length > config.gheight) {
				need_place = true;
				Piece.py(Piece.py() - 1);
			}

			if (coliding()) {
				Piece.py(Piece.py() - 1);
				need_place = true;
			}

			if (need_place) {
				place();
				clear_rows();
			}
		};

		var coliding = function() {
			var coliding = false;
			Piece.piece().forEach(function(row, i) {
				row.forEach(function(cell, j) {
					if (cell != '#FFF' && board[Piece.py() + i][Piece.px() + j] != '#FFF') {
						coliding = true;
						return coliding;
					}
				});
			});
			return coliding;
		};
					
		var move_right = function() {
			if (Piece.px() + Piece.piece()[0].length < config.gwidth) {
				Piece.px(Piece.px() + 1);
			}
			if (coliding()) {
				Piece.px(Piece.px() - 1);
			}
			display.draw(canvas, board);
		};
		var move_left = function() {
			if (Piece.px() > 0) {
				Piece.px(Piece.px() - 1);
			}
			if (coliding()) {
				Piece.px(Piece.px() + 1);
			}
			display.draw(canvas, board);
		};

		var rotate = function() {
			var old_px = Piece.px();
			Piece.rotate();
			if (Piece.px() + Piece.piece()[0].length >= config.gwidth) {
				Piece.px(Piece.px() - 1);
			}
			if (coliding()) {
				Piece.px(old_px);
				Piece.rotate();
				Piece.rotate();
				Piece.rotate();
			}
			display.draw(canvas, board);
		};

		var new_row = function() {
			var row = [];
			for (var i = 0; i < config.gwidth; i++) {
				row.push('#FFF');
			}
			return row;
		};

		var clear_rows = function() {
			// Look through widths, see if we should clear anything.
			// Shift represents the line offset for where the next board will be
			var shift = 0;
			// go bottom up to avoid extra work
			for (var i = widths.length - 1; i >= 0; i--) {
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
		};

		var drop = function() {
			var bottoms = [];
			var piece_height = Piece.piece().length - 1;
			for (var j = 0; j < Piece.piece()[0].length; j++) {
				var i = piece_height;
				while(Piece.piece()[i][j] == '#FFF' && i >= 0) {
					i--;
				}
				bottoms.push(i);
			}
			for (var i = Piece.py(); i < config.gheight - piece_height; i++) {
				for (var j = 0; j < Piece.piece()[0].length; j++) {
					if (board[i + bottoms[j]][Piece.px() + j] != '#FFF') {
						Piece.py(i - 1)
						place();
						clear_rows();
						display.draw(canvas, board);
						return;
				  }
				}
			}
			// We didn't hit anything
			Piece.py(config.gheight - piece_height - 1);
			place();
			clear_rows();
			display.draw(canvas, board);
		};

		this.board = board;
		this.update = update;
		this.move_right = move_right;
		this.move_left = move_left;
		this.rotate = rotate;
		this.drop = drop;
	}
	return {Game: Game};
});

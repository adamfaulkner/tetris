// Set up the global state
define('state', [], function() {
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
		var pieces = [
			// long piece
			[
				['#00F'],
				['#00F'],
				['#00F'],
				['#00F']
			],
			// square
			[
				['#FF0', '#FF0'],
				['#FF0', '#FF0']
			],
			// T
			[
				['#FFF', '#F00', '#FFF'],
				['#F00', '#F00', '#F00']
			],
			// squigle thing one
			[
				['#FFF', '#F0F', '#F0F'],
				['#F0F', '#F0F', '#FFF']
			],
			// squigle thing two
			[
				['#0F0', '#0F0', '#FFF'],
				['#FFF', '#0F0', '#0F0']
			]
		];
		
		// Choose a random piece
		var pick_piece = function() {
			var index = Math.floor(Math.random() * pieces.length);
			piece = pieces[index];
		};

		// Index into the pieces array
		var piece;
		pick_piece();
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
			piece.forEach(function(row, i) {
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
			if (coxliding()) {
				py -= 1;
				place = true;
			}
			place = place || py + piece.length >= gheight;
			if (place) {
				piece.forEach(function(row, i) {
					row.forEach(function(cell, j) {
						if (cell != '#FFF') {
							var y = py + i;
							var x = px + j;
							board[y][x] = cell;
						}
					});
				});
				py = 0;
				pick_piece();
			}
		};

		var coliding = function() {
			var coliding = false;
			piece.forEach(function(row, i) {
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
			if (px + 1 + piece[0].length < gwidth) {
				px += 1;
			}
			if (coliding()) {
				px -= 1;
			}
		};
		var move_left = function() {
			if (px > 0) {
				px -= 1;
			}
			if (coliding()) {
				py -= 1;
			}
		};



		this.board = board;
		this.draw = draw;
		this.update = update;
		this.move_right = move_right;
		this.move_left = move_left;
	}
	return {Game: Game};
});

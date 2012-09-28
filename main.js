// Set up the global state

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
	// Index into the pieces array
	// TODO: Random pieces
	var piece = pieces[0];
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
					var x = (px + j) * bwidth;
					var y = (py + i) * bheight;
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
		// Update current_heights
		current_heights = [];
		// TODO: Don't do this calculation, we can just subtract 1 in many cases
		for (var i = 0; i < piece[0].length; i++) {
			var piece_offset = 0;
			// Fortunately, if there isn't something on the bottom there's always one above it
			if (piece[piece.length - 1][i] == '#FFF') {
				piece_offset = 1;
			}
			var x = px + i;
			// py is the y coordinate of the top of the piece
			var y = py + piece.length - 1;
			var h = piece_offset;
			while(y + 1 < gheight && board[y + 1][x] == '#FFF') {
				y++;
				h++;
			}
			current_heights.push(h);
		}

		var place = false;
		current_heights.forEach(function(h) {
			if (h == 0) {
				place = true;
			}
		});

		if (place) {
			piece.forEach(function(row, i) {
				row.forEach(function(cell, j) {
					var y = py + i;
					var x = px + j;
					board[y][x] = cell;
				});
			});
			py = 0;
			// Piece is new random
		}
	};

	this.board = board;
	this.draw = draw;
	this.update = update;
}

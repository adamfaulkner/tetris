define('piece', [], function() {
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
		],
		// L thing one
		[
			['#C50', '#FFF'],
			['#C50', '#FFF'],
			['#C50', '#C50']
		],
		// L thing two
		[
			['#FFF', '#50F'],
			['#FFF', '#50F'],
			['#50F', '#50F']
		]
	];

	var make_rotates = function(piece, rotates) {
		var new_piece = [];
		// Loop through the rows, columns of the NEW piece
		for (var i = 0; i < piece[0].length; i++) {
			var new_row = [];
			for (var j = 0; j < piece.length; j++) {
				new_row.push(piece[piece.length - j - 1][i]);
			}
			new_piece.push(new_row);
		}
		if (rotates.length >= 4) {
			return rotates;
		} else {
			rotates.push(new_piece);
			return make_rotates(new_piece, rotates);
		}
	};

	// Choose a random piece
	var pick_piece = function(px, gwidth) {
		var index = Math.floor(Math.random() * pieces.length);
		piece = pieces[index];
		piece_rotates = make_rotates(piece, [piece]);
		current_rotation = 0;
		px = Math.min(px, gwidth - piece[0].length);
		return px;
	};

	var rotate = function() {
		current_rotation = ++current_rotation % piece_rotates.length;
		piece = piece_rotates[current_rotation];
	};

	// Index into the pieces array
	var piece;
	var piece_rotates;
	// Integer referring to current rotation
	var current_rotation;
	pick_piece();

	var get_piece = function() {
		return piece;
	};

	return { piece: get_piece,
					 pick_piece: pick_piece,
					 rotate: rotate
				 };
});

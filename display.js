define('display', ['config', 'piece'], function(config, Piece) {
	var draw = function(canvas, board) {
		var bwidth = config.width / config.gwidth;
		var bheight = config.height / config.gheight;
		var margin = 1;
		var ctx = canvas.getContext("2d");
		board.forEach(function(row, i) {
			row.forEach(function(cell, j) {
				ctx.fillStyle = cell;
				// We do a 1 px margin on each side
				var x = j * bwidth + margin;
				var y = i * bheight + margin;
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
					var x = (Piece.px() + j) * bwidth + margin;
					var y = (Piece.py() + i) * bheight + margin;
					var w = bwidth - margin;
					var h = bheight - margin;
					ctx.fillRect(x, y, w, h);
				}
			});
		});
	};
	return {draw : draw};
});

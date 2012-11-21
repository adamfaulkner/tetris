define('ai', ['state', 'config', 'display'], function(state, config, display) {
	// Weights for heights, height-diffs, widths, and rows cleared
	var weights = [100, 10, 1, -10];
	var canvas = document.getElementById('tetris-canvas');
	var score_indicator = document.getElementById('score');
	canvas.width = config.width;
	canvas.height = config.height;
	var game = new state.Game();
	var s = 0;
	display.draw(canvas, game.board, game.px(), game.py());

	// Modify this for more better behavior
	function score(widths, heights, rows_cleared) {
		// Initially, I'm just going to add heights to gwidth - widths, subtracting 10 times the rows cleared
		var s = 0;
		heights.forEach(function(height, i) {
			s += (config.gheight - height) * weights[0];
			if (i !== 0) {
				s += Math.abs(height - heights[i - 1]) * weights[1];
			}
			if (i != heights.length - 1) {
				s += Math.abs(height - heights[i + 1]) * weights[1];
			}
		});
		widths.forEach(function(width) {
			s += (config.gwidth - width) * weights[2];
		});
		s += weights[3] * rows_cleared;
		return s;
	}
		
	function get_best_move() {
		var j;
		var best_score = Infinity;
		var best_move = 0;
		var best_rotation = 0;
		// TODO: Don't rotate 4 times if this piece has less than 4 unique rotations
		var r;
		for (r = 0; r < 4; r++) {
			for (j = 0; j <= config.gwidth - game.current_piece()[0].length; j++) {
				var result = game.fake_drop(j);
				if (score(result[1], result[0], result[2]) < best_score) {
					best_move = j;
					best_score = score(result[1], result[0], result[2]);
					best_rotation = r;
				}
			}
			game.rotate();
		}
		// TODO: this is awful.
		while(best_rotation) {
			game.rotate();
			best_rotation--;
		}
		return best_move;
	}

	function make_move() {
		var best = get_best_move();
		var old_px;
		while(game.px() < best && old_px != game.px()) {
			old_px = game.px();
			game.move_right();
		}
		while(game.px() > best && old_px != game.px()) {
			old_px = game.px();
			game.move_left();
		}
		s += game.drop();
		score_indicator.textContent = s;
		display.draw(canvas, game.board, game.px(), game.py());
		if (!game.lost()) {
			setTimeout(make_move, 1);
		} else {
		}
	}

	make_move();
			
});

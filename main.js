define('main', ['state', 'display'], function(state, display) {
	var canvas = document.getElementById('tetris-canvas');
	var score_indicator = document.getElementById('score');
	var score = 0;
	var game = new state.Game(canvas);
	function update_score(new_score) {
		score_indicator.textContent = new_score;
	}
	window.onkeydown = function(key) {
		if (key.keyCode == 39) {
			// Right arrow key
			game.move_right();
		} else if (key.keyCode == 37) {
			// left arrow key
			game.move_left();
		} else if (key.keyCode == 38) {
			// up arrow key
			game.rotate();
		} else if (key.keyCode == 32){
			var lines_cleared = game.drop();
			if (lines_cleared) {
				score += lines_cleared;
				update_score(score);
			}
		}
	};
	display.draw(canvas, game.board, game.px(), game.py());

	var loop = function() {
		setTimeout(function() {
			var lines_cleared = game.update();
			if (game.lost()) {
				score = 0;
				update_score(score);
				game = new state.Game(canvas);
			}
			if (lines_cleared) {
				score += lines_cleared;
				update_score(score);
			}
			display.draw(canvas, game.board, game.px(), game.py());
			loop();
		}, 500);
	};
	loop();
});

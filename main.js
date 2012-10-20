define('main', ['state', 'display'], function(state, display) {
	var canvas = document.getElementById('tetris-canvas');
	var score_indicator = document.getElementById('score');
	var score = 0;
	var game = new state.Game(canvas);
	var last_touch_x;
	var last_touch_y;
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
	// I have no idea what I'm doing...
	document.addEventListener('touchstart', function(evt) {
		evt.preventDefault();
		var touch = evt.touches[0];
		last_touch_x = touch.pageX;
		last_touch_y = touch.pageY;
	});

	// I have no idea what I'm doing...
	document.addEventListener('touchmove', function(evt) {
		evt.preventDefault();
		var touch = evt.touches[0];
		var dx = touch.pageX - last_touch_x;
		var dy = touch.pageY - last_touch_y;
		var x_moved = Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 100;
		var y_moved = Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 100;
		if (x_moved) {
			last_touch_x = touch.pageX;
			if (dx < 0) {
				game.move_left();
			} else {
				game.move_right();
			}
		} else if (y_moved) {
			last_touch_y = touch.pageY;
			if (dy < 0) {
				game.rotate();
			} else {
				var lines_cleared = game.drop();
				if (lines_cleared) {
					score += lines_cleared;
					update_score(score);
				}
			}
		}
	});
		
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

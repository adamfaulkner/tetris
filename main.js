define('main', ['state'], function(state) {
	var game = new state.Game(document.getElementById('tetris-canvas'));
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
		}
	};
	game.draw();
	var loop = function() {
		setTimeout(function() {
			game.update();
			game.draw();
			loop();
		}, 500);
	};
	loop();
});

define('main', ['state'], function(state) {
	var game = new state.Game(document.getElementById('tetris-canvas'));
	window.onkeypress = function(key) {
		if (key.keyCode == 39) {
			game.move_right();
		} else if (key.keyCode == 37) {
			game.move_left();
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

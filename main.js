define('main', ['state', 'display'], function(state, display) {
	var canvas = document.getElementById('tetris-canvas');
	var game = new state.Game(canvas);
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
			game.drop();
		}
	};
	display.draw(canvas, game.board);

	var loop = function() {
		setTimeout(function() {
			game.update();
			display.draw(canvas, game.board);
			loop();
		}, 500);
	};
	loop();
});

var WallSolver = {
	solve: function (player, map) {
		var wTileX = Math.floor (player.x),
			wTileY = Math.floor (player.y);
		var wFloatX = player.x - wTileX,
			wFloatY = player.y - wTileY;
		var radius = Settings.player.radius;
		// Vertical walls
		if        (wFloatX <     radius*1.01 && map.getLeftWall (wTileX,     wTileY)) {
			wFloatX = radius*1.01;
			player.vx = 0;
		} else if (wFloatX > 1 - radius*1.01 && map.getLeftWall (wTileX + 1, wTileY)) {
			wFloatX = 1 - radius*1.01;
			player.vx = 0;
		}
		// Horizontal walls
		if        (wFloatY <     radius && map.getTopWall (wTileX, wTileY    )) {
			wFloatY = radius;
			player.vy = 0;
		} else if (wFloatY > 1 - radius && map.getTopWall (wTileX, wTileY + 1)) {
			wFloatY = 1 - radius;
			player.vy = 0;
		}
		// Corners
		if        (wFloatY + wFloatX <      radius && (map.getLeftWall (wTileX,     wTileY - 1) || map.getTopWall (wTileX - 1, wTileY    ))) { // Top left
			var dist = (wFloatY + wFloatX) - radius;
			wFloatX -= dist / 2;
			wFloatY -= dist / 2;
		} else if (wFloatY - wFloatX < -1 + radius && (map.getLeftWall (wTileX + 1, wTileY - 1) || map.getTopWall (wTileX + 1, wTileY    ))) { // Top right
			var dist = (wFloatY - wFloatX) - (-1 + radius);
			wFloatX += dist / 2;
			wFloatY -= dist / 2;
		} else if (wFloatY - wFloatX >  1 - radius && (map.getLeftWall (wTileX,     wTileY + 1) || map.getTopWall (wTileX - 1, wTileY + 1))) { // Bottom left
			var dist = (wFloatY - wFloatX) - (1 - radius);
			wFloatX += dist / 2;
			wFloatY -= dist / 2;
		} else if (wFloatY + wFloatX >  2 - radius && (map.getLeftWall (wTileX + 1, wTileY + 1) || map.getTopWall (wTileX + 1, wTileY + 1))) { // Bottom right
			var dist = (wFloatY + wFloatX) - (2 - radius);
			wFloatX -= dist / 2;
			wFloatY -= dist / 2;
		}
		player.x = wTileX + wFloatX;
		player.y = wTileY + wFloatY;
	}
}
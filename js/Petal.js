var Petal = {
	tx: undefined,
	ty: undefined,
	pathMap: [],
	
	init: function (tx, ty) {
		this.tx = tx;
		this.ty = ty;
	},
	
	takeStep: function (map, playerX, playerY) {
		var playerTX = Math.floor (playerX);
		var playerTY = Math.floor (playerY);
		this.rePathMap (map, playerTX, playerTY);
		
		var lowestDir = -1;
		var lowestVal = 999;
		var upVal    = this.ty > 0            && !map.getTopWall  (this.tx,     this.ty    ) ? this.pathMap[this.tx  ][this.ty-1] : -1;
		var downVal  = this.ty < map.height-1 && !map.getTopWall  (this.tx,     this.ty + 1) ? this.pathMap[this.tx  ][this.ty+1] : -1;
		var leftVal  = this.tx > 0            && !map.getLeftWall (this.tx,     this.ty    ) ? this.pathMap[this.tx-1][this.ty  ] : -1;
		var rightVal = this.tx < map.width-1  && !map.getLeftWall (this.tx + 1, this.ty    ) ? this.pathMap[this.tx+1][this.ty  ] : -1;
		if (upVal >= 0) {
			lowestDir = Dir.UP;
			lowestVal = upVal;
		}
		if (downVal >= 0 && downVal < lowestVal) {
			lowestDir = Dir.DOWN;
			lowestVal = downVal;
		}
		if (leftVal >= 0 && leftVal < lowestVal) {
			lowestDir = Dir.LEFT;
			lowestVal = leftVal;
		}
		if (rightVal >= 0 && rightVal < lowestVal) {
			lowestDir = Dir.RIGHT;
			lowestVal = rightVal;
		}
		switch (lowestDir) {
			case Dir.UP:
				this.ty--; break;
			case Dir.DOWN:
				this.ty++; break;
			case Dir.LEFT:
				this.tx--; break;
			case Dir.RIGHT:
				this.tx++;
		}
	},
	getPathMapTile: function (x, y) {
		var w = this.pathMap.length;
		var h = this.pathMap[0].length;
		if (0 <= x && x < w && 0 <= y && y < h) {
			return this.pathMap[x][y];
		} else {
			return -1;
		}
	},
	rePathMap: function (map, tx, ty) {
		if (this.pathMap.length) {
			for (var x = 0; x < map.width; x++) for (var y = 0; y < map.height; y++) {
				this.pathMap[x][y] = -1;
			}
		} else {
			for (var x = 0; x < map.width; x++) {
				this.pathMap.push ([]);
				for (var y = 0; y < map.height; y++) {
					this.pathMap[x].push (-1);
				}
			}
		}
		var changes = 1;
		var currentLevel = 0;
		while (changes > 0 && currentLevel < 400) { // Fill the map
			for (var x = 0; x < map.width; x++) for (var y = 0; y < map.height; y++) {
				if (this.pathMap[x][y] == -1) { // This tile is an empty space
					if (currentLevel == 0) {
						if (x == tx && y == ty) {
							this.pathMap[x][y] = 0;
							changes++;
						}
					} else {
						if (x >= 1            && this.pathMap[x - 1][y    ] == currentLevel - 1 && !map.getLeftWall (x,     y    ) ||
							x <  map.width-1  && this.pathMap[x + 1][y    ] == currentLevel - 1 && !map.getLeftWall (x + 1, y    ) ||
							y >= 1            && this.pathMap[x    ][y - 1] == currentLevel - 1 && !map.getTopWall  (x,     y    ) ||
							y <  map.height-1 && this.pathMap[x    ][y + 1] == currentLevel - 1 && !map.getTopWall  (x,     y + 1)) {
							this.pathMap[x][y] = currentLevel;
							changes++;
							if (x == this.tx && y == this.ty) {
								return true;
							}
						}
					}
				}
			}
			currentLevel++;
		}
		return false;
	}
};
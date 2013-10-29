var Map = {
	tiles: [],
	width: undefined,
	height: undefined,
	tileIsInBounds: function (x, y) {
		return 0 <= x && x < this.width
		    && 0 <= y && y < this.height;
	},
	getLeftWall: function (x, y) {
		return !this.tileIsInBounds (x, y) || this.tiles[x][y].left;
	},
	setLeftWall: function (x, y, value) {
		if (this.tileIsInBounds) this.tiles[x][y].left = value;
	},
	getTopWall: function (x, y) {
		return !this.tileIsInBounds (x, y) || this.tiles[x][y].top;
	},
	setTopWall: function (x, y, value) {
		if (this.tileIsInBounds) this.tiles[x][y].top = value;
	},
	getVisited: function (x, y) {
		return !this.tileIsInBounds (x, y) || this.tiles[x][y].visited;
	},
	setVisited: function (x, y, value) {
		if (this.tileIsInBounds) this.tiles[x][y].visited = value;
	},
	generate: function (width, height) {
		this.width = width;
		this.height = height;
		this.tiles = [];
		for (var x = 0; x < width; x++){
			this.tiles.push([]);
			for(var y = 0; y < height; y++){
				this.tiles[x].push({left:true, top:true, visited:false});
			}
		}
		this.carveMaze();
		this.removeDeadEnds();
	},
	carveMaze: function() {
		var cursor = {x: 0, y: 0};
		var pathStack = [];
		while (true) {
			this.setVisited (cursor.x, cursor.y, true);
			var unvisitedNeighbors = [];
			if (!this.getVisited (cursor.x - 1, cursor.y    )) unvisitedNeighbors.push (Dir.LEFT );
			if (!this.getVisited (cursor.x + 1, cursor.y    )) unvisitedNeighbors.push (Dir.RIGHT);
			if (!this.getVisited (cursor.x,     cursor.y - 1)) unvisitedNeighbors.push (Dir.UP   );
			if (!this.getVisited (cursor.x,     cursor.y + 1)) unvisitedNeighbors.push (Dir.DOWN );
			if (unvisitedNeighbors.length) {
				var randomDirection = this.pick (unvisitedNeighbors);
				pathStack.push ({x: cursor.x, y: cursor.y});
				switch (randomDirection) {
					case Dir.LEFT:
						this.setLeftWall (cursor.x,     cursor.y,     false);
						cursor.x--; break;
					case Dir.RIGHT:
						this.setLeftWall (cursor.x + 1, cursor.y,     false);
						cursor.x++; break;
					case Dir.UP:
						this.setTopWall  (cursor.x,     cursor.y,     false);
						cursor.y--; break;
					case Dir.DOWN:
						this.setTopWall  (cursor.x,     cursor.y + 1, false);
						cursor.y++;
				}
			} else if (pathStack.length) {
				cursor = pathStack.pop();
			} else {
				return;
			}
		}
	},
	removeDeadEnds: function(){
		for (var x = 0; x < this.width; x++) for (var y = 0; y < this.height; y++) {
			if (Math.random() < 0.6) {
				var walls = {
					left:   x == 0               ? this.wall.BOUND : (this.getLeftWall (x,     y    ) ? this.wall.WALL : this.wall.EMPTY),
					right:  x == this.width - 1  ? this.wall.BOUND : (this.getLeftWall (x + 1, y    ) ? this.wall.WALL : this.wall.EMPTY),
					top:    y == 0               ? this.wall.BOUND : (this.getTopWall  (x,     y    ) ? this.wall.WALL : this.wall.EMPTY),
					bottom: y == this.height - 1 ? this.wall.BOUND : (this.getTopWall  (x,     y + 1) ? this.wall.WALL : this.wall.EMPTY)
				};
				var surroundingWallCount =
					(walls.left   ? 1 : 0) +
					(walls.right  ? 1 : 0) +
					(walls.top    ? 1 : 0) +
					(walls.bottom ? 1 : 0);
				if (surroundingWallCount == 3) {
					var removableWalls = [];
					if (walls.left   == this.wall.WALL) removableWalls.push (Dir.LEFT );
					if (walls.right  == this.wall.WALL) removableWalls.push (Dir.RIGHT);
					if (walls.top    == this.wall.WALL) removableWalls.push (Dir.UP   );
					if (walls.bottom == this.wall.WALL) removableWalls.push (Dir.DOWN );
					var wallToRemove = this.pick (removableWalls);
					switch (wallToRemove) {
						case Dir.LEFT:
							this.setLeftWall (x,     y,     false); break;
						case Dir.RIGHT:
							this.setLeftWall (x + 1, y,     false); break;
						case Dir.UP:
							this.setTopWall  (x,     y,     false); break;
						case Dir.DOWN:
							this.setTopWall  (x,     y + 1, false);
					}
				}
			}
		}
	},
	pick: function (array) {
		return array [Math.floor (Math.random() * array.length)];
	},
	wall: {
		EMPTY: 0,
		WALL: 1,
		BOUND: 2
	}
};
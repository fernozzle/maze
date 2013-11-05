var GameState = {
	map: undefined,
	player: undefined,
	petal: undefined,
	timer: 0,
	deathTime: undefined,
	
	init: function() {
		this.map = Object.create (Map);
		this.map.generate (Settings.map.width, Settings.map.height);
		
		this.player = Object.create (Player);
		this.player.init (0.51 + Settings.player.startX, 0.49 + Settings.player.startY, 1);
		
		this.petal = Object.create (Petal);
		this.petal.init (Settings.petal.startX, Settings.petal.startY);
	}
}
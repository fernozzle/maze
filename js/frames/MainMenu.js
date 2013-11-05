var MainMenu = Extend.extend (Menu, {
	title: Strings.self.gameName,
	items: [
		{label: Strings.menu.play,     element: undefined, action: function() {
			var game = Object.create (Game);
			var gameContainer = this.frameManager.pushFrame (game);
			game.init (this.frameManager, gameContainer);
		}},
		{label: Strings.menu.settings, element: undefined, action: function(){alert("DUH! DOY! Any modification of this game from its current state would worsen it, obviously!")}},
	],
	className: "menu main-menu",

})
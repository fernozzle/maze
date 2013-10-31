var MainMenu = Object.create (Menu, {
	title: Strings.self.gameName,
	items: [
		{label: Strings.menu.play,     element: undefined, action: function() {
			var game = Object.create (Game);
			var gameContainer = frameManager.pushFrame (game);
			game.init (frameManager, gameContainer);
			game.requestPointerLock();
			game.start();
		}},
		{label: Strings.menu.settings, element: undefined, action: function(){console.log("Any modification of this game from its current state will worsen it.")}},
	],
	className: "main-menu",

})
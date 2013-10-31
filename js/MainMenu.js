var MainMenu = {
	frameManager: undefined,
	frameContainer: undefined,
	
	selectedItem: 0,
	title: Strings.self.gameName,
	items: [
		//{label: Strings.menu.play,     element: undefined, action: function(){console.log("Pretend you're playing the game!")}},
		{label: Strings.menu.play,     element: undefined, action: function() {
			var game = Object.create (Game);
			var gameContainer = frameManager.pushFrame (game);
			game.init (frameManager, gameContainer);
			game.start();
		}},
		{label: Strings.menu.settings, element: undefined, action: function(){console.log("Any modification of this game from its current state will worsen it.")}},
	],
	
	init: function (frameManager, frameContainer) {
		this.frameManager   = frameManager;
		this.frameContainer = frameContainer;
		
		var menu = document.createElement ("div");
		menu.className = "main-menu";
		this.frameContainer.appendChild (menu);
		
		var title = document.createElement ("h1");
		title.innerText = this.title;
		menu.appendChild (title);
		for (var i = 0; i < this.items.length; i++) {
			var itemListing = document.createElement ("div");
			itemListing.innerText = this.items[i].label;
			menu.appendChild (itemListing);
			this.items[i].element = itemListing;
		}
		
		this.selectItem (0);
	},
	
	selectItem: function (itemIndex) {
		var previousItemListing = this.items[this.selectedItem].element;
		previousItemListing.className = "";
		
		this.selectedItem = itemIndex;
		
		var newItemListing = this.items[this.selectedItem].element;
		newItemListing.className = "selected";
	},
	selectNextItem: function() {
		if (this.selectedItem < this.items.length - 1) {
			this.selectItem (this.selectedItem + 1);
		} else {
			this.selectItem (0);
		}
	},
	selectPreviousItem: function() {
		if (this.selectedItem > 0) {
			this.selectItem (this.selectedItem - 1);
		} else {
			this.selectItem (this.items.length - 1);
		}
	},
	keyIdDown: function (keyId) {
		switch (keyId) {
			case KeyId.down:
			case KeyId.backward:
				this.selectNextItem();
				break;
			case KeyId.up:
			case KeyId.forward:
				this.selectPreviousItem();
				break;
			case KeyId.select:
				this.items[this.selectedItem].action();
		}
	},
	keyIdUp: function (keyId) {
	}
};
var DeathMenu = Extend.extend (Menu, {
	title: Strings.death.deathMessage,
	items: [
		{
			label: Strings.death.quit,
			element: undefined,
			action: function() {
				this.frameManager.popFrame();
				this.frameManager.getCurrentFrame().quit();
			}
		}
	],
	className: "menu death-menu",
	
	init: function (frameManager, frameContainer, deathTime) {
		this.frameManager   = frameManager;
		this.frameContainer = frameContainer;
		
		var menu = document.createElement ("div");
		menu.className = this.className;
		this.frameContainer.appendChild (menu);
		
		var title = document.createElement ("h1");
		title.innerText = this.title;
		menu.appendChild (title);
		
		var timeLabel = document.createElement ("h2");
		timeLabel.innerText = this.formatTime(deathTime);
		menu.appendChild (timeLabel);
		
		for (var i = 0; i < this.items.length; i++) {
			var itemListingElement = document.createElement ("div");
			itemListingElement.innerText = this.items[i].label;
			itemListingElement.addEventListener ("click", this.items[i].action.bind(this), false);
			menu.appendChild (itemListingElement);
			this.items[i].element = itemListingElement;
		}
		
		this.selectItem (0);
	},
	
	formatTime: function (frames) {
		var seconds = frames / Settings.game.updateRate;
		var secondsPart = Math.floor(seconds % 60);
		var minutesPart = Math.floor(seconds / 60);
		
		var secondsString = secondsPart < 10 ? "0" + secondsPart : "" + secondsPart;
		
		return minutesPart + ":" + secondsString;
	}
})
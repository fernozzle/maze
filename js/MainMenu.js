var MainMenu = {
	frameManager: undefined,
	frameContainer: undefined,
	
	selectedOption: 0,
	options: [
		{label: Strings.menu.play,     action: function(){console.log("Pretend you're playing the game!")}},
		{label: Strings.menu.settings, action: function(){console.log("Any modification of this game from its current state will worsen it.")}},
	],
	
	init: function (frameManager, frameContainer) {
		this.frameManager   = frameManager;
		this.frameContainer = frameContainer;
		
		var menu = document.createElement ("div");
		menu.className = "main-menu";
		this.frameContainer.appendChild (menu);
		
		for (var i = 0; i < this.options.length; i++) {
			var optionListing = document.createElement ("div");
			optionListing.innerText = this.options[i].label;
			menu.appendChild (optionListing);
		}
	},
	
	keyIdDown: function (keyId) {
		/*switch (keyId) {
			case KeyId.left:
				this.keysDown.left = true;
				break;
			case KeyId.right:
				this.keysDown.right = true;
				break;
			case KeyId.forward:
				this.keysDown.forward = true;
				break;
			case KeyId.backward:
				this.keysDown.backward = true;
				break;
		}*/
	},
	keyIdUp: function (keyId) {
		/*switch (keyId) {
			case KeyId.left:
				this.keysDown.left = false;
				break;
			case KeyId.right:
				this.keysDown.right = false;
				break;
			case KeyId.forward:
				this.keysDown.forward = false;
				break;
			case KeyId.backward:
				this.keysDown.backward = false;
				break;
		}*/
	},
};
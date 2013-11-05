var PauseMenu = Extend.extend (Menu, {
	title: Strings.pauseMenu.paused,
	items: [
		{
			label: Strings.pauseMenu.resume,
			element: undefined,
			action: function(){
				this.frameManager.popFrame();
			}
		},
		{
			label: Strings.pauseMenu.quit,
			element: undefined,
			action: function() {
				this.frameManager.popFrame();
				this.frameManager.getCurrentFrame().quit();
			}
		}
	],
	className: "menu pause-menu",

})
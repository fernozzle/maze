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
	],
	className: "menu pause-menu",

})
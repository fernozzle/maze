var Game = {
	containerElement: null,
	graphics: null,
	map: null,
	
	init: function (containerElement) {
		// Set up container and canvas
		this.containerElement = containerElement;
		
		
		var displayCanvas = document.createElement ("canvas");
		this.containerElement.appendChild (displayCanvas);
		this.graphics = Object.create (Graphics);
		this.graphics.init (displayCanvas);
		
		this.map = Object.create (Map);
		this.map.generate (Settings.map.width, Settings.map.height);
		/*function loop() {
			window.requestAnimationFrame (loop);
			console.clear();
			console.log ("hi! " + Math.random());
		};
		window.requestAnimationFrame (loop);*/
		
	},
	
	
	
	start: function () {
		
	}
};
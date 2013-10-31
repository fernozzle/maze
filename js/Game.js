var Game = {
	containerElement: null,
	displayCanvas: null,
	
	map: null,
	
	init: function (containerElement) {
		// Set up container and canvas
		this.containerElement = containerElement;
		this.displayCanvas = document.createElement ("canvas");
		this.containerElement.appendChild (this.displayCanvas);
		
		this.map = Object.create (Map);
		this.map.generate (Settings.map.width, Settings.map.height);
		
		this.updateSize();
		/*function loop() {
			window.requestAnimationFrame (loop);
			console.clear();
			console.log ("hi! " + Math.random());
		};
		window.requestAnimationFrame (loop);*/
		window.addEventListener ("resize", this.updateSize.bind (this), false);
	},
	
	updateSize: function() {
		this.displayCanvas.width  = this.containerElement.clientWidth;
		this.displayCanvas.height = this.containerElement.clientHeight;
	},
	
	start: function () {
		
	}
};
var Game = {
	containerElement: undefined,
	graphics: undefined,
	state: undefined,
	
	init: function (containerElement) {
		this.containerElement = containerElement;
		
		this.state = Object.create (GameState);
		this.state.init();
		
		// Set up canvas and graphics
		var displayCanvas = document.createElement ("canvas");
		this.containerElement.appendChild (displayCanvas);
		this.graphics = Object.create (Graphics);
		this.graphics.init (displayCanvas, this.state);
	},
	
	
	start: function () {
		this.graphics.startRendering();
		window.setInterval (this.step.bind(this), 1000/60);
	},
	
	step: function() {
		this.state.player.x += 0.01;
	}
};
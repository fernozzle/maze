var Game = {
	frameManager: undefined,
	frameContainer: undefined,
	graphics: undefined,
	state: undefined,
	
	keysDown: {
		left:     false,
		right:    false,
		forward:  false,
		backward: false
	},
	
	init: function (frameManager, frameContainer) {
		this.frameManager   = frameManager;
		this.frameContainer = frameContainer;
		
		this.state = Object.create (GameState);
		this.state.init();
		
		// Set up canvas and graphics
		var displayCanvas = document.createElement ("canvas");
		this.frameContainer.appendChild (displayCanvas);
		this.graphics = Object.create (Graphics);
		this.graphics.init (displayCanvas, this.state);
	},
	
	keyIdDown: function (keyId) {
		switch (keyId) {
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
		}
	},
	keyIdUp: function (keyId) {
		switch (keyId) {
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
		}
	},
	
	start: function () {
		this.graphics.startRendering();
		window.setInterval (this.step.bind(this), 1000/60);
		this.frameContainer.addEventListener ("click", this.requestPointerLock.bind(this), false);
		this.frameContainer.addEventListener ("mousemove", this.mouseMove.bind(this), false);
	},
	
	step: function() {
		this.state.player.applyKeys (this.keysDown);
		this.state.player.applyVelocity();
		this.state.player.applyFriction (Settings.player.friction);
		WallSolver.solve (this.state.player, this.state.map);
	},
	
	requestPointerLock: function() {
		this.frameContainer.webkitRequestPointerLock();
	},
	mouseMove: function (e) {
		var dx = e.movementX       ||
				 e.mozMovementX    ||
				 e.webkitMovementX ||
				 0,
			dy = e.movementY       ||
				 e.mozMovementY    ||
				 e.webkitMovementY ||
				 0;
		this.state.player.turn (dx * Settings.controls.mouseSensitivity);
	}
};
var Game = {
	frameManager: undefined,
	frameContainer: undefined,
	graphics: undefined,
	state: undefined,
	
	stepInterval: undefined,
	framesSincePointerLock: 0,
	
	clickListener:             undefined,
	pointerLockChangeListener: undefined,
	mouseMoveListener:         undefined,
	
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
		
		this.start();
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
			/*case KeyId.menu:
				var pauseMenu = Object.create (PauseMenu);
				var pauseMenuContainer = this.frameManager.pushFrame (pauseMenu);
				pauseMenu.init (this.frameManager, pauseMenuContainer);
				this.frameManager*/
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
		this.clickListener             = this.requestPointerLock.bind(this);
		this.pointerLockChangeListener = this.pointerLockChange.bind(this);
		this.mouseMoveListener         = this.mouseMove.bind(this);
		
		this.focus();
	},
	
	focus: function() {
		this.requestPointerLock();
		this.graphics.startRendering();
		this.stepInterval = window.setInterval (this.step.bind(this), 1000 / Settings.game.updateRate);
		this.attachEventHandlers();
	},
	defocus: function() {
		this.graphics.stopRendering();
		window.clearInterval (this.stepInterval);
		this.framesSincePointerLock = 0;
		this.detachEventHandlers();
	},
	quit: function() {
		this.defocus();
		this.frameManager.popFrame();
	},
	
	attachEventHandlers: function() {
		this.frameContainer.addEventListener ("click", this.clickListener, false);
		document.addEventListener ("webkitpointerlockchange", this.pointerLockChangeListener, false);
		this.frameContainer.addEventListener ("mousemove", this.mouseMoveListener, false);
	},
	detachEventHandlers: function() {
		this.frameContainer.removeEventListener ("click", this.clickListener, false);
		document.removeEventListener ("webkitpointerlockchange", this.pointerLockChangeListener, false);
		this.frameContainer.removeEventListener ("mousemove", this.mouseMoveListener, false);
	},
	
	step: function() {
		if (this.state.player.alive) {
			this.state.player.applyKeys (this.keysDown);
			this.state.player.applyVelocity();
			this.state.player.applyFriction (Settings.player.friction);
			WallSolver.solve (this.state.player, this.state.map);
			
			if (this.state.timer % Settings.petal.boomFrames == 0) {
				this.state.petal.takeStep (this.state.map, this.state.player.x, this.state.player.y);
				/*console.clear();
				console.log ("Your location:");
				console.log ("  x: " + Math.floor(this.state.player.x));
				console.log ("  y: " + Math.floor(this.state.player.y));
				console.log ("Petal's location:");
				console.log ("  x: " + Math.floor(this.state.petal.tx));
				console.log ("  y: " + Math.floor(this.state.petal.ty));*/
			}
			if (Math.floor (this.state.player.x) == this.state.petal.tx && Math.floor (this.state.player.y) == this.state.petal.ty) {
				this.state.player.alive = false;
				this.state.deathTime = this.state.timer;
				this.detachEventHandlers();
				console.log ("You died!");
			}
		} else {
			var angleFromPlayerToPetal = Math.atan2 ((this.state.petal.ty + 0.5) - this.state.player.y, (this.state.petal.tx + 0.5) - this.state.player.x);
			this.state.player.turn (0.1 * (angleFromPlayerToPetal - this.state.player.angle));
			
			if (this.state.timer - this.state.deathTime == Settings.game.framesToShowDeathScreen) {
				this.exitPointerLock();
				this.showDeathMenu();
			}
		}
		
		this.state.timer++;
		this.framesSincePointerLock++;
	},
	
	requestPointerLock: function() {
		this.frameContainer.webkitRequestPointerLock();
	},
	exitPointerLock: function() {
		document.webkitExitPointerLock();
	},
	pointerLockChange: function (e) {
		console.log (e);
		var pointerLockElement = document.pointerLockElement    ||
		                         document.mozPointerLockElement ||
		                         document.webkitPointerLockElement;
		//if (!!pointerLockElement) { // Is there already a pointer lock element?
		if (pointerLockElement === this.frameContainer) {
			
		} else { // There is not; we just exited pointer lock
			if (this.state.player.alive) {
				this.showPauseMenu();
			}
		}
	},
	showPauseMenu: function() {
		var pauseMenu = Object.create (PauseMenu);
		var pauseMenuContainer = this.frameManager.pushFrame (pauseMenu);
		pauseMenu.init (this.frameManager, pauseMenuContainer);
	},
	showDeathMenu: function() {
		var deathMenu = Object.create (DeathMenu);
		var deathMenuContainer = this.frameManager.pushFrame (deathMenu);
		deathMenu.init (this.frameManager, deathMenuContainer, this.state.deathTime);
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
		if (this.framesSincePointerLock > 1) { // A very large mouse movement is reported after a pointer lock
			this.state.player.turn (dx * Settings.controls.mouseSensitivity);
		}
	}
};
var FrameManager = {
	container: undefined,
	frames: [],
	init: function(container) {
		this.container = container;
		document.addEventListener ("keydown", this.keyDown.bind(this), false);
		document.addEventListener ("keyup",   this.keyUp  .bind(this), false);
	},
	
	// Frame handling
	getCurrentFrame: function() {
		return this.frames[this.frames.length - 1];
	},
	// Pushes the frame object to `frames` and returns the container DOM element to use
	pushFrame: function (frame) {
		if (this.frames.length)
			this.getCurrentFrame().defocus();
		
		this.frames.push (frame);
		
		var frameContainer = document.createElement ("div");
		frameContainer.className = "frame-container";
		this.container.appendChild (frameContainer);
		return frameContainer;
	},
	popFrame: function() {
		var removedFrame = this.frames.pop();
		this.container.removeChild (removedFrame.frameContainer);
		
		this.getCurrentFrame().focus();
	},
	
	// Key handling
	keyDown: function (e) {
		e.preventDefault();
		var keyId = this.getKeyId(e.keyCode);
		if (keyId && this.frames.length) {
			this.getCurrentFrame().keyIdDown (keyId);
		}
	},
	keyUp: function (e) {
		e.preventDefault();
		var keyId = this.getKeyId(e.keyCode);
		if (keyId && this.frames.length) {
			this.getCurrentFrame().keyIdUp (keyId);
		}
	},
	
	getKeyId: function (keyCode) {
		
		var keyId;
		switch (keyCode) {
			case Settings.controls.keys.left:
				keyId = KeyId.left;
				break;
			case Settings.controls.keys.right:
				keyId = KeyId.right;
				break;
			case Settings.controls.keys.forward:
				keyId = KeyId.forward;
				break;
			case Settings.controls.keys.backward:
				keyId = KeyId.backward;
				break;
			case Settings.controls.keys.up:
				keyId = KeyId.up;
				break;
			case Settings.controls.keys.down:
				keyId = KeyId.down;
				break;
			case Settings.controls.keys.menu:
				keyId = KeyId.menu;
				break;
			case Settings.controls.keys.select:
				keyId = KeyId.select;
				break;
			default:
				keyId = 0;
		}
		return keyId;
	}
}
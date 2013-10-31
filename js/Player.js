var Player = {
	x: undefined,
	y: undefined,
	vx: undefined,
	vy: undefined,
	angle: undefined,
	
	init: function (x, y, angle) {
		this.x = x;
		this.y = y;
		this.vx = 0;
		this.vy = 0;
		this.angle = angle;
	},
	
	turn: function (angleToTurn) {
		this.angle += angleToTurn;
	},
	applyForce: function (accelX, accelY) {
		this.vx += accelX;
		this.vy += accelY;
	},
	applyKeys: function (keysDown) {
		var angleSin = Math.sin (this.angle);
		var angleCos = Math.cos (this.angle);
		var accelX = 0;
		var accelY = 0;
		if (keysDown.left) {
			accelX += angleSin;
			accelY -= angleCos;
		}
		if (keysDown.right) {
			accelX -= angleSin;
			accelY += angleCos;
		}
		if (keysDown.forward) {
			accelX += angleCos;
			accelY += angleSin;
		}
		if (keysDown.backward) {
			accelX -= angleCos;
			accelY -= angleSin;
		}
		this.applyForce (accelX * Settings.player.speed, accelY * Settings.player.speed);
	},
	applyVelocity: function() {
		this.x += this.vx;
		this.y += this.vy;
	},
	applyFriction: function (friction) {
		this.vx *= friction;
		this.vy *= friction;
	}
}
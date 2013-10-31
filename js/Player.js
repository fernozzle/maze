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
	}
}
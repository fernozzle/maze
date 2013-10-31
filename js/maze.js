var container = document.getElementById ("container");

var game = Object.create (Game);
game.init (container);
game.start();

/*var tilePx = 60;
var timeSinceBoom = 0;

var petalImage = new Image();
petalImage.src = Settings.petal.imagePath;
Map.generate (Settings.map.width, Settings.map.height);
var player = {
	x: 0.51 + Settings.player.startX,
	y: 0.49 + Settings.player.startY,
	vx: 0,
	vy: 0,
	tx: 0,
	ty: 0,
	ptx: 0,
	pty: 0,
	a: 1,
	radius: 0.05 // 0.01 is the minimum before passing through walls
};

var keysDown = {
	left: false,
	right: false,
	up: false,
	down: false,
	w: false,
	a: false,
	s: false,
	d: false
};
var timer = 0;

var display = document.getElementById("display");
display.width = window.innerWidth;
display.height = window.innerHeight;
var c = display.getContext("2d");

Petal.rePathMap (Map, player.tx, player.ty);

document.addEventListener ("keydown", function (e) {
	e.preventDefault();
	switch (e.keyCode) {
		case Settings.controls.keys.left:
			keysDown.left = true;
			break;
		case Settings.controls.keys.right:
			keysDown.right = true;
			break;
		case Settings.controls.keys.forward:
			keysDown.up = true;
			break;
		case Settings.controls.keys.backward:
			keysDown.down = true;
	}
}, false);
document.addEventListener ("keyup", function (e) {
	e.preventDefault();
	switch (e.keyCode) {
		case Settings.controls.keys.left:
			keysDown.left = false;
			break;
		case Settings.controls.keys.right:
			keysDown.right = false;
			break;
		case Settings.controls.keys.forward:
			keysDown.up = false;
			break;
		case Settings.controls.keys.backward:
			keysDown.down = false;
	}
}, false);

var ptx = 0, pty = 0;
var forwardness = 0;
document.addEventListener ("touchstart", function (e) {
	e.preventDefault();
	var touch = e.changedTouches[0];
	ptx = touch.screenX;
	pty = touch.screenY;
}, false);
document.addEventListener ("touchmove", function (e) {
	e.preventDefault();
	var touch = e.changedTouches[0];
	var dx = touch.screenX - ptx;
	player.a += dx * 0.01;
	forwardness = (touch.screenY / window.innerHeight) * -2 + 1;
	forwardness *= 2;
	forwardness = Math.max (-1, Math.min (1, forwardness));
	
	ptx = touch.screenX;
	pty = touch.screenY;
}, false);
document.addEventListener ("touchend", function (e) {
	forwardness = 0;
}, false);
document.addEventListener ("mousemove", function (e) {
	var dx = e.movementX       ||
	         e.mozMovementX    ||
	         e.webkitMovementX ||
	         0,
	    dy = e.movementY       ||
	         e.mozMovementY    ||
	         e.webkitMovementY ||
	         0;
	player.a += dx * Settings.controls.mouseSensitivity;
}, false);
function change(e) {
	
}


c.canvas.addEventListener('pointerlockchange', change, false);
c.canvas.addEventListener('mozpointerlockchange', change, false);
c.canvas.addEventListener('webkitpointerlockchange', change, false);
c.canvas.addEventListener ("click", function (e) {
	c.canvas.webkitRequestPointerLock();
}, false);
var raf = window.webkitRequestAnimationFrame;
function loop() {
	raf (loop);
	Painter.drawMap (Map, Petal, c);
};
loop();*/
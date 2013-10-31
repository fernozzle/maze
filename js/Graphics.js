var Graphics = {
	canvas: undefined,
	state: undefined,
	
	init: function (canvas, state) {
		this.canvas = canvas;
		
		this.state = state;
		
		this.updateCanvasSize();
		window.addEventListener ("resize", this.updateCanvasSize.bind (this), false);
	},
	
	updateCanvasSize: function() {
		this.canvas.width  = this.canvas.parentNode.clientWidth;
		this.canvas.height = this.canvas.parentNode.clientHeight;
	},
	
	startRendering: function() {
		window.requestAnimationFrame (this.draw.bind(this));
	},
	
	draw: function(){
		window.requestAnimationFrame (this.draw.bind(this));
		var context = this.canvas.getContext ("2d");
		/*player.vx += Math.cos (player.a) * Settings.player.speed * forwardness;
		player.vy += Math.sin (player.a) * Settings.player.speed * forwardness;
		var dirCos = Math.cos (player.a),
			dirSin = Math.sin (player.a);
		if (keysDown.up) {
			player.vx += dirCos * Settings.player.speed;
			player.vy += dirSin * Settings.player.speed;
		}
		if (keysDown.down) {
			player.vx -= dirCos * Settings.player.speed;
			player.vy -= dirSin * Settings.player.speed;
		}
		if (keysDown.left) {
			player.vx += dirSin * Settings.player.speed;
			player.vy -= dirCos * Settings.player.speed;
		}
		if (keysDown.right) {
			player.vx -= dirSin * Settings.player.speed;
			player.vy += dirCos * Settings.player.speed;
		}
		//player.a += 0.02;
		player.x += player.vx;
		player.y += player.vy;
		player.vx *= Settings.player.friction;
		player.vy *= Settings.player.friction;
		Physics.solve (player, map);
		player.tx = Math.floor (player.x);
		player.ty = Math.floor (player.y);
		
		timeSinceBoom++;
		if (timeSinceBoom == Settings.petal.boomFrames && Settings.petal.enabled) {
			timeSinceBoom = 0;
			
			if (player.ptx != player.tx || player.pty != player.ty || true) {
				petal.rePathMap (map, player.tx, player.ty);
				player.ptx = player.tx;
				player.pty = player.ty;
			}
			for (var steps = 0; steps < 1; steps++) {
				var lowestDir = -1;
				var lowestVal = 999;
				var upVal    = petal.ty > 0            && !map.getTopWall  (petal.tx,     petal.ty    ) ? petal.pathMap[petal.tx  ][petal.ty-1] : -1;
				var downVal  = petal.ty < map.height-1 && !map.getTopWall  (petal.tx,     petal.ty + 1) ? petal.pathMap[petal.tx  ][petal.ty+1] : -1;
				var leftVal  = petal.tx > 0            && !map.getLeftWall (petal.tx,     petal.ty    ) ? petal.pathMap[petal.tx-1][petal.ty  ] : -1;
				var rightVal = petal.tx < map.width-1  && !map.getLeftWall (petal.tx + 1, petal.ty    ) ? petal.pathMap[petal.tx+1][petal.ty  ] : -1;
				if (upVal >= 0) {
					lowestDir = Dir.UP;
					lowestVal = upVal;
				}
				if (downVal >= 0 && downVal < lowestVal) {
					lowestDir = Dir.DOWN;
					lowestVal = downVal;
				}
				if (leftVal >= 0 && leftVal < lowestVal) {
					lowestDir = Dir.LEFT;
					lowestVal = leftVal;
				}
				if (rightVal >= 0 && rightVal < lowestVal) {
					lowestDir = Dir.RIGHT;
					lowestVal = rightVal;
				}
				switch (lowestDir) {
					case Dir.UP:
						petal.ty--; break;
					case Dir.DOWN:
						petal.ty++; break;
					case Dir.LEFT:
						petal.tx--; break;
					case Dir.RIGHT:
						petal.tx++;
				}
			}
		}
		timer++;*/
		context.clearRect (0, 0, this.canvas.width, this.canvas.height);
		/*c.lineWidth = 10;
		c.strokeStyle = "black";
		
		
		// Player
		c.beginPath();
		c.arc (tilePx*player.x, tilePx*player.y, tilePx/2, 0, 2*Math.PI);
		c.fillStyle = "blue";
		c.fill();
		// Petal
		c.beginPath();
		c.arc (tilePx*petal.tx+tilePx/2, tilePx*petal.ty+tilePx/2, tilePx/2, 0, 2*Math.PI);
		c.fillStyle = "red";
		c.fill();*/
		/*var w = c.canvas.width,
			h = c.canvas.height;*/
		
		var scene = [];
		Renderer.render (this.state.map, this.state.player.x, this.state.player.y, this.state.player.angle, scene, this.state.petal.tx, this.state.petal.ty,
			(this.canvas.width / this.canvas.height) / Settings.graphics.idealRatio * Settings.graphics.idealFov,
			false);
		var petalRealDistance = 100;
		if (Settings.petal.enabled) {
			this.dist (this.state.player.x, this.state.player.y, this.state.petal.tx + 0.5, this.state.petal.ty + 0.5);
		}
		
		var timeSinceBoom = 10000;

		var petalEffectGamma = Math.max (0, 2 / (petalRealDistance / Settings.graphics.petalFalloff + 1) - 1);
		petalEffectGamma *= 1 - timeSinceBoom / Settings.petal.boomFrames;
		var petalEffectVignette = Math.max (0, 2 / (petalRealDistance / Settings.graphics.petalFalloff + 1) - 1);
		var gamma = Settings.graphics.gamma + (Settings.graphics.petalGammaAdd * petalEffectGamma);
		var horizon = 0.3;
		var bg = context.createLinearGradient (0, 0, 0, this.canvas.height);
		bg.addColorStop (horizon, "hsl(0,0%,0%)");
		bg.addColorStop (0,       "hsl(0,0%," + (Math.pow (.15, gamma) * 100) + "%)");
		bg.addColorStop (1,       "hsl(0,0%," + (Math.pow (.15, gamma) * 100) + "%)");
		context.fillStyle = bg;
		context.rect (0, 0, this.canvas.width, this.canvas.height);
		context.fill();
		
		var petalX = scene[0];
		var petalDistance = scene[1];
		if (Settings.graphics.shadows) {
			for (var i = 2; i < scene.length; i += 8) {
				var vLeftX  = scene[i    ],
					vLeftD  = scene[i + 1];
				var vLeftEd = scene[i + 3];
				var vRightX = scene[i + 4],
					vRightD = scene[i + 5];
				var vRightEd= scene[i + 7];
				var shadScale = 0.5;
				if (vLeftEd || true && vLeftD < shadScale) {
					var opacity = 1 - Math.pow (vLeftX, 12); opacity *= 0.2;
					context.fillStyle = "rgba(0,0,0," + opacity + ")";
					context.beginPath();
					context.moveTo (((vLeftX - 0.5) / vLeftD * shadScale + 0.5) * this.canvas.width, horizon * this.canvas.height);
					context.lineTo (vLeftX * this.canvas.width, (horizon - 0.2 / vLeftD) * this.canvas.height);
					context.lineTo (vLeftX * this.canvas.width, (horizon + 0.5 / vLeftD) * this.canvas.height);
					context.fill();
				}
				if (vRightEd || true && vRightD < shadScale) {
					var opacity = 1 - Math.pow (vRightX - 1, 12); opacity *= 0.2;
					context.fillStyle = "rgba(0,0,0," + opacity + ")";
					context.beginPath();
					context.moveTo (((vRightX - 0.5) / vRightD * shadScale + 0.5) * this.canvas.width, horizon * this.canvas.height);
					context.lineTo (vRightX * this.canvas.width, (horizon - 0.2 / vRightD) * this.canvas.height);
					context.lineTo (vRightX * this.canvas.width, (horizon + 0.5 / vRightD) * this.canvas.height);
					context.fill();
				}
			}
		}
		for (var i = 2; i < scene.length; i += 8) {
			if (!scene[i + 2]) {
				this.drawWall (this.canvas, context, scene, horizon, i, gamma, petalEffectVignette);
			}
		}
		if (petalDistance > 0 && Settings.petal.enabled) {
			var petalScale = 1 / petalDistance;
			context.drawImage (petalImage, petalX * w - 0.35*petalScale*h, (horizon - 0.2*petalScale)*h, 0.7*petalScale*h, 0.7*petalScale*h);
		}
		for (var i = 2; i < scene.length; i += 8) {
			if (scene[i + 2]) {
				this.drawWall (this.canvas, context, scene, horizon, i, gamma, petalEffectVignette);
			}
		}
		/*for(var x = 0; x <= Map.width; x++) for (var y = 0; y <= Map.height; y++) {
			if(Map.getLeftWall (x, y)){
				c.beginPath();
				c.moveTo(x*tilePx-0.5, y*tilePx-0.5);
				c.lineTo(x*tilePx-0.5, (y+1)*tilePx-0.5);
				c.stroke();
			}
			if(Map.getTopWall (x, y)){
				c.beginPath();
				c.moveTo(x*tilePx-0.5, y*tilePx-0.5);
				c.lineTo((x+1)*tilePx-0.5, y*tilePx-0.5);
				c.stroke();
			}*/
			/*if (petal.pathMap[x][y] != -1) {
				c.beginPath();
				c.fillStyle = "hsl(" + (petal.pathMap[x][y] + 150) + ", 100%, 50%)";
				c.rect (x*tilePx, y*tilePx, tilePx, tilePx);
				c.fill();
			}*/
		//}
	},
	drawWall: function (canvas, context, scene, horizon, i, gamma, petalEffect) {
		context.beginPath();
		var vLeftX  = scene[i    ],
			vLeftD  = scene[i + 1];
		var vRightX = scene[i + 4],
			vRightD = scene[i + 5];
		var shade   = scene[i + 6] * 0.8 + 0.2;
		context.moveTo (vLeftX  * canvas.width,     (horizon + 0.5/vLeftD ) * canvas.height);
		context.lineTo (vLeftX  * canvas.width,     (horizon - 0.2/vLeftD ) * canvas.height);
		context.lineTo (vRightX * canvas.width + 1, (horizon - 0.2/vRightD) * canvas.height);
		context.lineTo (vRightX * canvas.width + 1, (horizon + 0.5/vRightD) * canvas.height);
		var vignetteStrength = Settings.graphics.vignette + petalEffect * Settings.graphics.petalVignetteAdd;
		var leftVignette  = Math.max (0, 1 - vignetteStrength * Math.pow (vLeftX  - 0.5, 2));
		var rightVignette = Math.max (0, 1 - vignetteStrength * Math.pow (vRightX - 0.5, 2));
		var leftColor  = Math.pow (vLeftD  + 1.3, -2) * shade * leftVignette,
			rightColor = Math.pow (vRightD + 1.3, -2) * shade * rightVignette;
		if (Settings.graphics.gradients) {
			var g = context.createLinearGradient (vLeftX * this.canvas.width, 0, vRightX * this.canvas.width, 0);
			g.addColorStop (0, "hsl(0,0%," + (Math.floor(Math.pow (leftColor,  gamma) * 1000) / 10) + "%)");
			g.addColorStop (1, "hsl(0,0%," + (Math.floor(Math.pow (rightColor, gamma) * 1000) / 10) + "%)");
			context.fillStyle = g;
		} else {
			context.fillStyle = "hsl(0,0%," + (Math.floor(Math.pow (leftColor, gamma) * 1000) / 10) + "%)";
		}
		context.fill();
	},
	dist: function (x1, y1, x2, y2) {
		return Math.sqrt (
			(x2 - x1) * (x2 - x1) +
			(y2 - y1) * (y2 - y1)
		);
	}
}
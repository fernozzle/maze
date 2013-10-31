var Settings = {
	map: {
		width: 30,
		height: 30
	},
	player: {
		speed: 0.005,
		friction: 0.6,
		radius: 0.05,
		startX: 15,
		startY: 15
	},
	petal: {
		enabled: true,
		startX: 18,
		startY: 18,
		boomFrames: 60,
		imagePath: "a.png",
	},
	controls: {
		mouseSensitivity: 0.0005,
		keys: {
			/*left: 37,
			right: 39,
			forward: 38,
			backward: 40*/
			left:     65, // A
			right:    68, // D
			forward:  87, // W
			backward: 83, // S
			menu:     27, // Escape
			select:   13, // Enter
		}
	},
	graphics: {
		idealRatio: 16/9,
		idealFov: 2,
		shadows: true,
		gradients: true,
		gamma: 0.7, // max 1.3
		petalGammaAdd: 1,
		vignette: 3,
		petalVignetteAdd: 10,
		petalFalloff: 10,
	}
};
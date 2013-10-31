var Renderer = {
	render: function (map, wX, wY, wAngle, scene, wPX, wPY, fov, debug) {
		if (debug) {
			c.save();
			c.scale (tilePx, tilePx);
			c.lineWidth = 0.05;
		}
		var wVecX = Math.cos (wAngle),
		    wVecY = Math.sin (wAngle);
		var wStartEdgeAngle = wAngle + this.vXToWRelativeAngle (0, fov);
		var wStartEdgeVecX = Math.cos (wStartEdgeAngle),
		    wStartEdgeVecY = Math.sin (wStartEdgeAngle);
		var wEndEdgeAngle = wAngle + this.vXToWRelativeAngle (1, fov);
		var wEndEdgeVecX = Math.cos (wEndEdgeAngle),
		    wEndEdgeVecY = Math.sin (wEndEdgeAngle);
		var currentHue = 300, hueStep = 30;
		var hitRightEdge = false;
		
		scene.push (this.wPosToVX (Petal.tx + 0.5, Petal.ty + 0.5, wX, wY, wVecX, wVecY, fov));
		scene.push (this.wPosToVD (Petal.tx + 0.5, Petal.ty + 0.5, wX, wY, wVecX, wVecY));
		
		var wRayVecX = wStartEdgeVecX,
		    wRayVecY = wStartEdgeVecY;
		var wRayOriginX = wX,
		    wRayOriginY = wY;
			
		var lookup;
		if (Math.floor(wY) < wPY) lookup = 0;
		else if (Math.floor(wY) == wPY) lookup = 3;
		else lookup = 6;
		
		if (Math.floor(wX) < wPX) lookup += 0;
		else if (Math.floor(wX) == wPX) lookup += 1;
		else lookup += 2;
		
		
		do {
			var rtResult = this.raytrace (map, wRayOriginX, wRayOriginY, wRayVecX, wRayVecY);
			if (debug) {
				c.beginPath();
				c.moveTo (wRayOriginX, wRayOriginY);
				c.lineTo (rtResult.wX, rtResult.wY);
				c.stroke();
			}
			var wNextX = Math.floor (rtResult.wX) + (rtResult.wIsVertical ? 0 : (wRayVecY > 0 ? 0 : 1));
			var wNextY = Math.floor (rtResult.wY) + (rtResult.wIsVertical ? (wRayVecX > 0 ? 1 : 0) : 0);
			var triStartX = rtResult.wX,
				triStartY = rtResult.wY,
				triVert   = rtResult.wIsVertical;
			var startedAnEdge = 0;
			while (!hitRightEdge) {
				// ---- TRIANGLE TEST ----
				while (true) {
					// WALL START
					scene.push (this.wPosToVX (triStartX, triStartY, wX, wY, wVecX, wVecY, fov));
					scene.push (this.wPosToVD (triStartX, triStartY, wX, wY, wVecX, wVecY));
					if (debug) {
						c.beginPath();
						c.fillStyle = "hsla(" + currentHue + ",100%,50%,0.5)";
						currentHue += hueStep;
						c.moveTo (wX, wY);
						c.lineTo (triStartX, triStartY);
					}
					var lookup2;
					if (triVert) {
						if (Math.floor ((triStartY + wNextY)/2) < wPY) lookup2 = 0;
						else if (Math.floor ((triStartY + wNextY)/2) == wPY) lookup2 = 3;
						else lookup2 = 6;
						
						if (Math.floor ((triStartX + wNextX)/2) <= wPX) lookup2 += 0;
						else lookup2 += 2;
					} else {
						if (Math.floor ((triStartY + wNextY)/2) <= wPY) lookup2 = 0;
						else lookup2 = 6;
						
						if (Math.floor ((triStartX + wNextX)/2) < wPX) lookup2 += 0;
						else if (Math.floor ((triStartX + wNextX)/2) == wPX) lookup2 += 1;
						else lookup2 += 2;
					}
					scene.push (this.sliceCases[lookup][lookup2]);
					scene.push (startedAnEdge);
					
					var triangleResult = this.triangleTest (map, wX, wY, triStartX, triStartY, wNextX, wNextY, triVert);

					var wPossibleTriStartX = triangleResult.wCollisionX,
						wPossibleTriStartY = triangleResult.wCollisionY;
					
					// if the test found a wall and the wall starts in view
					if (triangleResult.found && this.cross (wPossibleTriStartX - wX, wPossibleTriStartY - wY, wEndEdgeVecX, wEndEdgeVecY) >= 0) {
						// WALL END
						scene.push (this.wPosToVX (triangleResult.wCutoffX, triangleResult.wCutoffY, wX, wY, wVecX, wVecY, fov));
						scene.push (this.wPosToVD (triangleResult.wCutoffX, triangleResult.wCutoffY, wX, wY, wVecX, wVecY));
						scene.push (Math.abs (triVert ? wVecX : wVecY));
						scene.push (0);
						startedAnEdge = 1;
						if (debug) {
							c.lineTo (triangleResult.wCutoffX, triangleResult.wCutoffY);
							c.fill();
						}
						
						triStartX = wPossibleTriStartX;
						triStartY = wPossibleTriStartY;
						triVert   = triangleResult.wIsVertical;
						wNextX = triangleResult.wWallX + (triangleResult.wIsVertical ? 0 : (wPossibleTriStartY > wY ? 0 : 1));
						wNextY = triangleResult.wWallY + (triangleResult.wIsVertical ? (wPossibleTriStartX > wX ? 1 : 0) : 0);
					} else break;
				}
				
				// ---- EXTENDS OFF RIGHT EDGE ----
				if (this.cross (wNextX - wX, wNextY - wY, wEndEdgeVecX, wEndEdgeVecY) < 0) { // if the wall's end is CW of the right screen side
					var wEndClipX, wEndClipY;
					if (triVert) {
						wEndClipX = triStartX;
						wEndClipY = this.getPosOnLine (wY, triStartX - wX, wEndEdgeVecY / wEndEdgeVecX);
					} else {
						wEndClipX = this.getPosOnLine (wX, triStartY - wY, wEndEdgeVecX / wEndEdgeVecY);
						wEndClipY = triStartY;
					}
					// WALL END
					scene.push (this.wPosToVX (wEndClipX, wEndClipY, wX, wY, wVecX, wVecY, fov));
					scene.push (this.wPosToVD (wEndClipX, wEndClipY, wX, wY, wVecX, wVecY));
					scene.push (Math.abs (triVert ? wVecX : wVecY));
					scene.push (0);
					if (debug) {
						c.lineTo (wEndClipX, wEndClipY);
						c.fill();
						c.beginPath();
						c.moveTo (wX, wY);
						c.lineTo (wEndClipX, wEndClipY);
						c.stroke();
					}
					hitRightEdge = true;
					break;
				} else { // RIGHT-POINTING WALLS
					// WALL END
					var closestWall = this.pickClosestWall (map, wNextX, wNextY, wNextX - wX, wNextY - wY);
					scene.push (this.wPosToVX (wNextX, wNextY, wX, wY, wVecX, wVecY, fov));
					scene.push (this.wPosToVD (wNextX, wNextY, wX, wY, wVecX, wVecY));
					scene.push (Math.abs (triVert ? wVecX : wVecY));
					scene.push (closestWall == Dir.NONE ? 1 : 0);
					startedAnEdge = 0; // this should be 1 if it's convex
					if (debug) {
						c.lineTo (wNextX, wNextY);
						c.fill();
					}
					
					if (closestWall != Dir.NONE) {
						triStartX = wNextX;
						triStartY = wNextY;
						wNextX += closestWall === Dir.LEFT  ? -1 :
						          closestWall === Dir.RIGHT ?  1 : 0;
						wNextY += closestWall === Dir.UP    ? -1 :
						          closestWall === Dir.DOWN  ?  1 : 0;
						triVert = closestWall === Dir.UP || closestWall == Dir.DOWN;
					} else {
						wRayOriginX = wNextX;
						wRayOriginY = wNextY;
						wRayVecX = wNextX - wX;
						wRayVecY = wNextY - wY;
						break;
					}
				}
			}
		} while (!hitRightEdge);
		if (debug) c.restore();
	},
	pickClosestWall: function (map, wTileX, wTileY, wRX, wRY) { // the wR vars are the direction from the camera to the point
		var wRight = wRX > 0;
		var wDown  = wRY > 0;
		//  _ \
		//   | *
		if (wRight && wDown) {
			if      (map.getTopWall  (wTileX - 1, wTileY    )) return Dir.LEFT;
			else if (map.getLeftWall (wTileX,     wTileY    )) return Dir.DOWN;
		//  _| /
		//    *
		} else if (!wRight && wDown) {
			if      (map.getLeftWall (wTileX,     wTileY - 1)) return Dir.UP;
			else if (map.getTopWall  (wTileX - 1, wTileY    )) return Dir.LEFT;
		//  * |_
		//   \.
		} else if (!wRight && !wDown) {
			if      (map.getTopWall  (wTileX,     wTileY    )) return Dir.RIGHT;
			else if (map.getLeftWall (wTileX,     wTileY - 1)) return Dir.UP;
		//   * _
		//  / |
		} else {
			if      (map.getLeftWall (wTileX,     wTileY    )) return Dir.DOWN;
			else if (map.getTopWall  (wTileX,     wTileY    )) return Dir.RIGHT;
		}
		return Dir.NONE;
	},
	triangleTest: function (map, wX, wY, wStartX, wStartY, wEndX, wEndY, wWallIsVertical) {
		var result = {
			wCollisionX: 0,
			wCollisionY: 0,
			wWallX: 0,
			wWallY: 0,
			wCutoffX: 0,
			wCutoffY: 0,
			wIsVertical: false,
			found: false
		};
		if (wWallIsVertical) {
			var wXStep = wStartX > wX ? 1 : 0;
			var winningAmountY;
			for (var wPointX = (wXStep ? Math.ceil (wX) : Math.floor (wX)); wPointX !== wStartX; wPointX += wXStep * 2 - 1) {
				var alongXDistance = Util.rLerp (wPointX, wX, wStartX);
				var wUpperLimitY = Util.lerp (wY, wXStep ? wEndY : wStartY, alongXDistance);
				var wLowerLimitY = Util.lerp (wY, wXStep ? wStartY : wEndY, alongXDistance);
				for (var wPointY = Math.ceil (wLowerLimitY); wPointY < wUpperLimitY; wPointY++) {
					var closestWall = this.pickClosestWall (map, wPointX, wPointY, wXStep, wPointY - wY);
					if (closestWall != Dir.NONE) {
						var currentAmountY = Util.rLerp (wPointY, wLowerLimitY, wUpperLimitY);
						if (!result.found || (wXStep ? currentAmountY < winningAmountY : currentAmountY > winningAmountY)) {
							result.wWallX = wPointX + (closestWall === Dir.LEFT ?  -1 : 0);
							result.wWallY = wPointY + (closestWall === Dir.UP   ?  -1 : 0);
							result.wCollisionX = wPointX;
							result.wCollisionY = wPointY;
							result.wIsVertical = closestWall === Dir.UP || closestWall === Dir.DOWN;
							result.wCutoffX = wStartX;
							result.wCutoffY = this.getPosOnLine (wY, wStartX-wX, (wPointY - wY)/(wPointX - wX));
							result.found = true;
							winningAmountY = currentAmountY;
						}
					}
				}
			}
		} else {
			var wYStep = wStartY > wY ? 1 : 0;
			var winningAmountX;
			for (var wPointY = (wYStep ? Math.ceil (wY) : Math.floor (wY)); wPointY !== wStartY; wPointY += wYStep * 2 - 1) {
				var alongYDistance = Util.rLerp (wPointY, wY, wStartY);
				var wUpperLimitX = Util.lerp (wX, wYStep ? wStartX : wEndX, alongYDistance);
				var wLowerLimitX = Util.lerp (wX, wYStep ? wEndX : wStartX, alongYDistance);
				for (var wPointX = Math.ceil (wLowerLimitX); wPointX < wUpperLimitX; wPointX++) {
					var closestWall = this.pickClosestWall (map, wPointX, wPointY, wPointX - wX, wYStep);
					if (closestWall != Dir.NONE) {
						var currentAmountX = Util.rLerp (wPointX, wLowerLimitX, wUpperLimitX);
						if (!result.found || (wYStep ? currentAmountX > winningAmountX : currentAmountX < winningAmountX)) {
							result.wWallX = wPointX + (closestWall === Dir.LEFT ?  -1 : 0);
							result.wWallY = wPointY + (closestWall === Dir.UP   ?  -1 : 0);
							result.wCollisionX = wPointX;
							result.wCollisionY = wPointY;
							result.wIsVertical = closestWall === Dir.UP || closestWall === Dir.DOWN;
							result.wCutoffX = this.getPosOnLine (wX, wStartY-wY, (wPointX - wX)/(wPointY - wY));
							result.wCutoffY = wStartY;
							result.found = true;
							winningAmountX = currentAmountX;
						}
					}
				}
			}
		}
		return result;
	},
	wPosToVD: function (wX, wY, wPlayerX, wPlayerY, wUnitDirX, wUnitDirY) {
		return this.dot (wX - wPlayerX, wY - wPlayerY, wUnitDirX, wUnitDirY);
	},
	wPosToVX: function (wX, wY, wPlayerX, wPlayerY, wUnitDirX, wUnitDirY, fov) {
		var wRelativeX = wX - wPlayerX,
		    wRelativeY = wY - wPlayerY;
		var wDirDistance = this.wPosToVD (wX, wY, wPlayerX, wPlayerY, wUnitDirX, wUnitDirY);
		if (wDirDistance < 0) return -1;
		// World distance between view center and view right based on dirDistance
		var wWidthRadius = wDirDistance * fov / 2;
		var wCenterX = wPlayerX +  wUnitDirX * wDirDistance,
		    wCenterY = wPlayerY +  wUnitDirY * wDirDistance;
		
		var wLeftX  = wCenterX +  wUnitDirY * wWidthRadius,
		    wLeftY  = wCenterY + -wUnitDirX * wWidthRadius;
		var wRightX = wCenterX -  wUnitDirY * wWidthRadius,
		    wRightY = wCenterY - -wUnitDirX * wWidthRadius;
		
		var vX = Math.abs(wRelativeY / wRelativeX) < 0.5 ?
			Util.rLerp (wX, wLeftX, wRightX) :
			Util.rLerp (wY, wLeftY, wRightY);
		return vX;
	},
	vXToWRelativeAngle: function (vX, fov) {
		// vX from 0 - 1;
		// angle relative to view center
		return Math.atan2 ((vX * 2 - 1) * fov / 2, 1);
	},
	getPosOnLine: function (wPosAlongLine, wDistFromLine, wSlope) { // wSlope is toward-wall over along-wall
		return wPosAlongLine + wDistFromLine * wSlope;
	},
	raytrace: function (map, wX, wY, wRX, wRY) { // wRX and wRY don't need to be unit
		var wCurrentX = wX,
		    wCurrentY = wY;
		var wCurrentTileX = Math.floor (wX),
		    wCurrentTileY = Math.floor (wY);
		var wRSlope = wRY / wRX;
		var wTileStepX = wRX > 0 ? 1 : 0,
		    wTileStepY = wRY > 0 ? 1 : 0;
		while (true) {
			var wNextColumnX = wCurrentTileX + wTileStepX,
			    wNextRowY    = wCurrentTileY + wTileStepY;
			var wNextColumnDistX = Math.abs (wNextColumnX - wCurrentX),
			    wNextRowDistY    = Math.abs (wNextRowY    - wCurrentY);
			var wXStepIsNext = wNextColumnDistX < wNextRowDistY / Math.abs (wRSlope);
			var wNextColumnDestY = this.getPosOnLine (wCurrentY, wNextColumnDistX, (wTileStepX * 2 - 1) * wRSlope),
				wNextRowDestX    = this.getPosOnLine (wCurrentX, wNextRowDistY,    (wTileStepY * 2 - 1) / wRSlope);
			if (wXStepIsNext) {
				if (map.getLeftWall (wNextColumnX, wCurrentTileY) && wNextColumnX != wX) { // Hit a vertical wall that isn't exactly where the camera is?
					return {
						wIsVertical: true,
						wX: wNextColumnX,
						wY: wNextColumnDestY
					};
				} else {
					wCurrentY = wNextColumnDestY;
					wCurrentTileX = wNextColumnX + wTileStepX - 1;
					wCurrentX = wNextColumnX;
				}
			} else {
				if (map.getTopWall (wCurrentTileX, wNextRowY) && wNextRowY != wY) { // Hit a horizontal wall that isn't exactly where the camera is?
					return {
						wIsVertical: false,
						wX: wNextRowDestX,
						wY: wNextRowY
					};
				} else {
					wCurrentX = wNextRowDestX;
					wCurrentTileY = wNextRowY + wTileStepY - 1;
					wCurrentY = wNextRowY;
				}
			}
		}
	},
	dot: function (x1, y1, x2, y2) {
		return x1 * x2 + y1 * y2;
	},
	cross: function (x1, y1, x2, y2) {
		return x1 * y2 - x2 * y1;
	},
	tilePerpendicularRight: function (tileStep) {
		return Point (1 - tileStep.y, tileStep.x);
	},
	sliceCases: [
		[1, 1, 0,
		 1, 0, 0,
		 0, 0, 0],	[0, 1, 0,
					 0, 0, 0,
					 0, 0, 0],	[0, 1, 1,
								 0, 0, 1,
								 0, 0, 0],
		[0, 0, 0,
		 1, 0, 0,
		 0, 0, 0],	[0, 0, 0, 
					 0, 0, 0,
					 0, 0, 0],	[0, 0, 0,
								 0, 0, 1,
								 0, 0, 0],
		[0, 0, 0,
		 1, 0, 0,
		 1, 1, 0],	[0, 0, 0,
					 0, 0, 0,
					 0, 1, 0],	[0, 0, 0,
								 0, 0, 1,
								 0, 1, 1],
	]
}
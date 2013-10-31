var Util = {
	lerp: function (x1, x2, f) {
		return x1 + f * (x2 - x1);
	},
	rLerp: function (x, x1, x2) { // get f
		return (x - x1) / (x2 - x1);
	},
	extend: function(object, props) {
		var prop, newObject;
		newObject = Object.create(object);
		for(prop in props) {
			if(props.hasOwnProperty(prop)) {
				newObject[prop] = props[prop];
			}
		}
		return newObject;
	}
};
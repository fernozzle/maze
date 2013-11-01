var Extend = {
	extend: function(object, properties) {
		var property, newObject;
		newObject = Object.create(object);
		for(property in properties) {
			if(properties.hasOwnProperty(property)) {
				newObject[property] = properties[property];
			}
		}
		return newObject;
	}
}
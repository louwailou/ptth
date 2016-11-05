function cloneObjectWithNullPrototype(obj) {
	var object = Object.create(null);

	for (var property in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, property)) {
			object[property] = obj[property];
		}
	}

	return object;
}
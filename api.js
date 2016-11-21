Layout = {};

Layout.register = function (data) {
	keys = Object.keys(data);

	keys.forEach(function (name) {
		LayoutInternal.data[name] = data[name];

		if (data[name].default) {
			Layout.set(name, data[name].default)			
		}
	});
}

Layout.set = function (key, value) {
	if (typeof key === "object") {
		keys = Object.keys(key)

		keys.forEach(function (oneKey) {
			Layout.set(oneKey, key[oneKey])
		});
	} else {
		LayoutInternal.state.set(key, value)
	}
}

Layout.get = function (target) {
	return LayoutInternal.state.get(target);
}

Layout.all = function () {
	return LayoutInternal.state.all();
}

Layout.equals = function (a,b) {
	return LayoutInternal.state.equals(a,b);
}
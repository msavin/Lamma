LayoutInternal = {};
LayoutInternal.data = {};
LayoutInternal.state = new ReactiveDict("Lamma");

LayoutInternal.ifTemplateExists = function (name) {
	if (Object.keys(Template).indexOf(name) === -1) {
		return false;
	} else {
		return true;
	}
}

LayoutInternal.getTemplateName = function (config) {
	if (config.Parrot === true) {
		template = Router.get();
	} else if (config.Parrot) {
		template = Router.get(self.name);
	} else  {
		template = LayoutInternal.state.get(self.name) || config.default;

		if (!template) {
			if (Meteor.isDevelopment) {
				console.log('Lamma could not find template identifier');
				return "Layout_debugOnly_notConfigured";
			}
		}
	}
}

LayoutInternal.generateTemplateName = function (layout, template) {
	var config = LayoutInternal.data[layout],
		template;

	// If no name is present, grab the default
	if (!template) {
		template = config.default;
	}
	
	// process the name if needed
	if (typeof config.processor === "function") {
		template = config.processor(template);
	}

	// the end
	return template;
}

LayoutInternal.generateErrorTemplate = function (layout) {
	var config = LayoutInternal.data[layout];

	if (typeof config.notFound === "string") {
		template = LayoutInternal.generateTemplateName(layout, config.notFound);
		return template;
	} else if (typeof config.notFound === "function") {
		configNotFoundResult = config.notFound();
		template = LayoutInternal.generateTemplateName(layout, configNotFoundResult);
		return template;
	} else if (config.default) {
		template = LayoutInternal.generateTemplateName(layout, config.default);
		if (LayoutInternal.ifTemplateExists(template)) {
			return template;
		} else {
			if (Meteor.isDevelopment) {
				return "Layout_debugOnly_notFound";
			}
		}
	} else {		
		if (Meteor.isDevelopment) {
			return "Layout_debugOnly_notConfigured";
		}
	}	
}
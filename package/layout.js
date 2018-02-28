Template.Layout.helpers({
	template: function () {
		var self = this,
			config = LayoutInternal.data[self.name],
			template = null,
			target = null;

		// Ensure such a configuration exists
		if (!config) {
			if (Meteor.isDevelopment) {
				console.log('Lamma could not find a proper configuration for the "' + self.name + '" layout.');
				return "Layout_debugOnly_notConfigured";
			}
		}

		// Grab the target template name
		LayoutInternal.getTemplateName(config);

		// Run the template naem through the processor
		target = LayoutInternal.generateTemplateName(self.name, template);

		// Check if the template exists or return error
		if (LayoutInternal.ifTemplateExists(target)) {
			return target;
		} else if (Meteor.isDevelopment) {
			errorTemplate = LayoutInternal.generateErrorTemplate(self.name, template);
			console.log('Lamma could not find template "' + target + '"');
			return errorTemplate;
		}
	}
});
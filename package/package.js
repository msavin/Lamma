Package.describe({
	name:    'msavin:lamma',
	summary: 'Layout Manager for Blaze',
	version: '1.0.0'
});

clientFiles  = [
	'layout.html',
	'layout.js',
	'internal.js',
	'api.js'
];

Package.onUse(function(api) {
	api.addFiles(clientFiles, 'client');
	api.versionsFrom('1.0');
	api.use(['blaze-html-templates','reactive-dict'], 'client');
	api.export("Layout", "client")
	api.export("LayoutInternal", "client")
});
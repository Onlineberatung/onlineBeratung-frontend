module.exports = {
	project: 'VI Frontend Framework 5',
	global: {
		externalResources: {
			'vi-css-helper': ['helper.css', 'print.css'],
			'@biotope/resource-loader': 'src/resourceLoader.js',
			'jquery': 'dist/jquery.js',
			'jquery-migrate': 'dist/jquery-migrate.js',
			'enquire.js': 'dist/enquire.js',
			'sanitize.css': 'sanitize.css',
			'handlebars': 'dist/handlebars.runtime.js',
			'core-js-bundle': 'minified.js'
		}
	},
	connect: {
		historyFallbackIndex: '/beratung-hilfe.html'
	},
	webpack: {
		tsWatchPatterns: [
			'resources/ts/**/*.tsx',
			'components/**/*.tsx',
			'globalState/**/*.tsx'
		],
		tsEntryPoints: ['./src/components/registration/ts/initRegistration']
	}
};

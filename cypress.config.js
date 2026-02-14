const _ = require('lodash');
const { defineConfig } = require('cypress');

let conf;
try {
	conf = require('./src/extensions/cypress/cypress.json') || {};
} catch (e) {
	console.log('No cypress.json file found, using default configuration');
	conf = {};
}

module.exports = defineConfig(
	_.mergeWith(
		{
			e2e: {
				baseUrl: 'http://localhost:5173',
				supportFile: 'cypress/support/e2e.{js,jsx,ts,tsx}',
				setupNodeEvents(on, config) {
					// Vite handles TypeScript compilation automatically
					return config;
				},
				specPattern: ['cypress/e2e/**/*.cy.ts']
			},
			env: {
				CYPRESS_WS_URL:
					process.env.CYPRESS_WS_URL || process.env.VITE_API_URL
			},
			retries: {
				runMode: 2
			},
			video: false,
			chromeWebSecurity: false,
			viewportWidth: 1200,
			viewportHeight: 800,
			defaultCommandTimeout: 30000,
			modifyObstructiveCode: false
		},
		conf,
		(objValue, srcValue) =>
			_.isArray(objValue) ? objValue.concat(srcValue) : undefined
	)
);

const _ = require('lodash');
const { defineConfig } = require('cypress');

// @ts-ignore
const wp = require('@cypress/webpack-preprocessor');

const options = {
	webpackOptions: {
		resolve: {
			extensions: ['.ts', '.tsx', '.js']
		},
		module: {
			rules: [
				{
					test: /\.tsx?$/,
					loader: 'ts-loader',
					options: { transpileOnly: true }
				}
			]
		}
	}
};

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
				testIsolation: true,
				baseUrl: 'http://localhost:9001',
				supportFile: 'cypress/support/e2e.{js,jsx,ts,tsx}',
				setupNodeEvents(on, config) {
					on('file:preprocessor', wp(options));
				},
				specPattern: ['cypress/e2e/**/*.cy.ts']
			},
			env: {
				CYPRESS_WS_URL:
					process.env.CYPRESS_WS_URL || process.env.REACT_APP_API_URL
			},
			retries: {
				runMode: 2
			},
			experimentalMemoryManagement: true,
			numTestsKeptInMemory: 20,
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

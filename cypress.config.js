const { defineConfig } = require('cypress');

const wp = require('@cypress/webpack-preprocessor');

module.exports = defineConfig({
	e2e: {
		baseUrl: 'http://localhost:9001',
		supportFile: 'cypress/support/e2e.{js,jsx,ts,tsx}',
		setupNodeEvents(on, config) {
			on(
				'file:preprocessor',
				wp({
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
				})
			);
		}
	},
	env: {
		CYPRESS_WS_URL:
			process.env.CYPRESS_WS_URL || process.env.REACT_APP_API_URL
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
});

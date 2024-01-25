/**
 * This is NOT the default proxy logic like described on react-scripts because we already
 * migrated to devServer setupMiddlewares to get rid of deprecations. This proxy logic will work
 * with the devServer and the production express server instance. So it needs to be .js not .ts
 *
 * [
 *     {
 *         method: 'GET',
 *         name: 'example-get-middleware',
 *         path: '/get',
 *         middleware: (req, res, next) => {}
 *     },
 *     {
 *         method: 'POST',
 *         name: 'example-post-middleware',
 *         path: '/post',
 *         middleware: (req, res, next) => {}
 *     },
 *     {
 *         name: 'example-use-middleware-with-path',
 *         path: '/use-with-path',
 *         middleware: (req, res, next) => {}
 *     },
 *     {
 *         name: 'example-use-middleware-without-path',
 *         middleware: (req, res, next) => {}
 *     },
 * ]
 *
 * @returns {[{path?: string, method?: string, name: string, middleware: middleware}]}
 */

const settingsProxy = require('./settings');
const weblateProxy = require('./weblate');
const path = require('path');
const { proxyPath } = require('../config');

module.exports = (storagePath) =>
	[...settingsProxy(), ...weblateProxy(storagePath)]
		.map(({ path: route, ...routeConfig }) =>
			route
				? { ...routeConfig, path: path.join(proxyPath, route) }
				: routeConfig
		)
		.filter(({ name, middleware }) => name && middleware);

const fs = require('fs');
const path = require('path');
const {
	createProxyMiddleware,
	responseInterceptor
} = require('http-proxy-middleware');
const { proxyPath } = require('../config');

const LOCALIZATION_CACHE_TIME = process.env.LOCALIZATION_CACHE_TIME || 120;
const updateInProgress = {};

const weblateHost = process.env.LOCALIZATION_WEBLATE_HOST || null;
const weblatePath = process.env.LOCALIZATION_WEBLATE_PATH || '';
const weblateApiKey = process.env.LOCALIZATION_WEBLATE_API_KEY || null;

module.exports = (storagePath) => {
	if (!weblateHost) return [];

	let weblateStoragePath = storagePath;
	if (weblateStoragePath) {
		weblateStoragePath = path.join(storagePath, 'weblate');
		try {
			fs.accessSync(weblateStoragePath);
		} catch {
			fs.mkdirSync(weblateStoragePath, { recursive: true });
		}
	}

	const weblateProxy = (config = {}) =>
		createProxyMiddleware({
			target: weblateHost,
			changeOrigin: true,
			xfwd: false,
			headers: {
				...(weblateApiKey && {
					Authorization: `Token ${weblateApiKey}`
				})
			},
			pathRewrite: {
				[`^${proxyPath}`]: ''
			},
			selfHandleResponse: true,
			...config
		});

	const loadFilesystem = (cacheFile) => {
		if (!weblateStoragePath)
			throw new Error('Weblate storage not configured!');
		const translationLifeTime = LOCALIZATION_CACHE_TIME * 60 * 1000;
		const localeFilePath = path.join(weblateStoragePath, cacheFile);
		// Use require because on multiple includes nodejs will use the memory cache on next read
		const localeFile = require(localeFilePath);

		// If translation gets invalid and there is no other user updating fallback to ui
		if (
			localeFile.ts + translationLifeTime < new Date().getTime() &&
			!updateInProgress?.[cacheFile]
		) {
			updateInProgress[cacheFile] = true;
			console.log(`Translation ${cacheFile} expired. Will be renewed!`);
			throw new Error(
				`Translation ${cacheFile} expired. Will be renewed ...`
			);
		}

		return localeFile;
	};

	const saveFilesystem = (cacheFile, data) => {
		if (!weblateStoragePath)
			throw new Error('Weblate storage not configured!');
		const localeFilePath = path.join(weblateStoragePath, cacheFile);
		fs.promises
			.writeFile(
				localeFilePath,
				JSON.stringify({ ...data, ts: new Date().getTime() })
			)
			.then(() => {
				console.log(`Translation ${cacheFile} renewed`);
				delete require.cache[require.resolve(localeFilePath)];
				updateInProgress[cacheFile] = false;
			});
	};

	return [
		{
			method: 'GET',
			name: 'weblate-languages-storage',
			path: '/api/projects/:project/languages/',
			middleware: (req, res, next) => {
				const { project } = req.params;
				try {
					const localeFile = loadFilesystem(
						`languages.${project}.json`
					);
					res.send(localeFile);
				} catch {
					// locale file could not be loaded. Use api instead
					next();
				}
			}
		},
		{
			method: 'GET',
			name: 'weblate-languages-api',
			path: '/api/projects/:project/languages/',
			middleware: weblateProxy({
				onProxyRes: responseInterceptor(
					async (responseBuffer, proxyRes, req, res) => {
						const { project } = req.params;
						const { statusCode } = proxyRes;

						if (statusCode >= 400 && statusCode < 600)
							return responseBuffer;

						const contentType =
							proxyRes.headers['content-type'] || '';
						if (contentType.indexOf('application/json') === -1)
							return responseBuffer;

						res.removeHeader('content-disposition');
						let data = JSON.parse(responseBuffer.toString('utf8'));
						const translationData = {
							ts: new Date().getTime(),
							data
						};

						// Save the new loaded data to file system and reset require cache
						try {
							saveFilesystem(
								`languages.${project}.json`,
								translationData
							);
						} catch {
							// Do nothing we already show an error on loading
						}

						return JSON.stringify(translationData);
					}
				)
			})
		},
		{
			method: 'GET',
			name: 'weblate-storage',
			path: '/api/translations/:project/:ns/:lng/*',
			middleware: (req, res, next) => {
				const { ns, lng } = req.params;

				// Check file storage for valid translation
				try {
					const localeFile = loadFilesystem(`${ns}.${lng}.json`);
					res.send(localeFile);
				} catch {
					// locale file could not be loaded. Use api instead
					next();
				}
			}
		},
		{
			method: 'GET',
			name: 'weblate-api',
			path: '/api/translations/:project/:ns/:lng/*',
			middleware: weblateProxy({
				onProxyRes: responseInterceptor(
					async (responseBuffer, proxyRes, req, res) => {
						const { ns, lng } = req.params;
						const { statusCode } = proxyRes;

						if (statusCode >= 400 && statusCode < 600)
							return responseBuffer;

						const contentType =
							proxyRes.headers['content-type'] || '';
						if (contentType.indexOf('application/json') === -1)
							return responseBuffer;

						res.removeHeader('content-disposition');
						let data = JSON.parse(responseBuffer.toString('utf8'));
						const translationData = {
							ts: new Date().getTime(),
							lng: req.params.lng,
							ns: req.params.ns,
							data
						};

						// Save the new loaded data to file system and reset require cache
						try {
							saveFilesystem(
								`${ns}.${lng}.json`,
								translationData
							);
						} catch {
							// Do nothing we already show an error on loading
						}

						return JSON.stringify(translationData);
					}
				)
			})
		}
	].map(({ path: route, ...routeConfig }) =>
		route
			? { ...routeConfig, path: path.join(weblatePath, route) }
			: routeConfig
	);
};

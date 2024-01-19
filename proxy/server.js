const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand').expand;
dotenvExpand(dotenv.config());

process.env.REACT_APP_CSRF_WHITELIST_HEADER_PROPERTY =
	process.env.CSRF_WHITELIST_HEADER_FOR_LOCAL_DEVELOPMENT;

process.on('unhandledRejection', (err) => {
	throw err;
});

const port = parseInt(process.env.PORT, 10) || 3000;
const host = process.env.HOST || '0.0.0.0';

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);
const storagePath =
	process.env.STORAGE_PATH && resolveApp(process.env.STORAGE_PATH);

const createServer = async () => {
	if (port == null) {
		return;
	}

	if (storagePath) {
		await fs.promises
			.access(storagePath)
			.catch(() => fs.promises.mkdir(storagePath, { recursive: true }));
	}

	const buildPath = resolveApp('build');
	await fs.promises.access(buildPath);

	app.use((await import('compression')).default());
	app.use(
		(await import('serve-static')).default(buildPath, {
			index: 'beratung-hilfe.html'
		})
	);

	const middlewareConfigs = require(resolveApp('./routes'))(storagePath);
	middlewareConfigs.forEach(
		({ method, middleware: callback, path: route }) => {
			const middleware = [];

			if (route) {
				middleware.push(route);
			}
			middleware.push(callback);

			if (!method) {
				app.use(...middleware);
				return;
			}

			app[method.toLowerCase()](...middleware);
		}
	);

	app.get('*', (req, res) => {
		res.sendFile(path.join(buildPath, 'beratung-hilfe.html'));
	});

	return new Promise((resolve) => {
		app.listen(port, resolve);
	}).then(() => {
		['SIGINT', 'SIGTERM'].forEach(function (sig) {
			process.on(sig, function () {
				process.exit();
			});
		});

		if (process.env.CI !== 'true') {
			// Gracefully exit when stdin ends
			process.stdin.on('end', function () {
				process.exit();
			});
		}
	});
};

createServer()
	.then(() => {
		console.log('Starting the server...\n');
		console.log(`http://${host}:${port}`);
	})
	.catch((e) => {
		if (e && e.message) {
			console.log(e.message);
		}
		process.exit(1);
	});

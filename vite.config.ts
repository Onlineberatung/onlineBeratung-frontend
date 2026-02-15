import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import path from 'path';

const DEFAULT_API_TARGET = 'https://happylife.develop.onlineberatung.net';

const settingsScssPath = path.posix.join(__dirname.replace(/\\/g, '/'), 'src/resources/styles/settings.scss');

const logger = {
	info: (...args: unknown[]) => console.log(...args),
	error: (...args: unknown[]) => console.error(...args)
};

function attachProxyLogging(proxy: any) {
	proxy.on('error', (err: any, _req: any, _res: any) => {
		logger.error('proxy error', err);
	});
	proxy.on('proxyReq', (proxyReq: any, req: any, _res: any) => {
		logger.info(
			'Sending Request to the Target:',
			req.method,
			req.url
		);
	});
	proxy.on('proxyRes', (proxyRes: any, req: any, _res: any) => {
		logger.info(
			'Received Response from the Target:',
			proxyRes.statusCode,
			req.url
		);
	});
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');

	return {
		plugins: [
			react({
				// Use React 18's new JSX transform
				jsxRuntime: 'automatic'
			}),
			svgr({
				include: '**/*.svg?react',
				svgrOptions: {
					// Export React component as default
					exportType: 'default',
					ref: true,
					svgo: true,
					svgoConfig: {
						plugins: [
							{
								name: 'preset-default',
								params: {
									overrides: {
										// Keep viewBox for proper scaling
										removeViewBox: false,
										// Keep IDs for internal references like masks, defs
										cleanupIds: false
									}
								}
							}
						]
					},
					titleProp: true
				}
			}),
			tsconfigPaths(),
			nodePolyfills({
				// Enable polyfills for browser
				include: ['buffer', 'process', 'util', 'stream'],
				globals: {
					Buffer: true,
					global: true,
					process: true
				}
			})
		],
		resolve: {
			alias: {
				'@': path.resolve(__dirname, './src')
			}
		},
		css: {
			preprocessorOptions: {
				scss: {
					api: 'modern-compiler', // Use modern Sass API instead of legacy
					// All @use statements must come before any @import statements
					additionalData: `@use "sass:color";\n@use "sass:meta";\n@import "${settingsScssPath}";\n`,
					// Suppress deprecation warnings from dependencies and legacy code
					// - import: We use @import extensively (142+ files). Migrating to @use/@forward
					//   requires 2-3 weeks of dedicated effort. See SCSS_DEPRECATIONS.md
					// - color-functions: From dependencies (sanitize.css, etc.)
					silenceDeprecations: ['import', 'color-functions', 'if-function']
				}
			}
		},
		server: {
			port: 5173,
			host: true,
			proxy: {
				'/service': {
					target:
						env.VITE_API_URL ||
						DEFAULT_API_TARGET,
					changeOrigin: true,
					secure: false,
					ws: true, // Enable WebSocket support for /service/live/* endpoints
					configure: (proxy, _options) => {
						attachProxyLogging(proxy);
					}
				},
				'/api': {
					target:
						env.VITE_API_URL ||
						DEFAULT_API_TARGET,
					changeOrigin: true,
					secure: false,
					configure: (proxy, _options) => {
						attachProxyLogging(proxy);
					}
				},
				'/auth': {
					target:
						env.VITE_API_URL ||
						DEFAULT_API_TARGET,
					changeOrigin: true,
					secure: false,
					configure: (proxy, _options) => {
						attachProxyLogging(proxy);
					}
				},
				'/websocket': {
					target:
						env.VITE_API_URL ||
						DEFAULT_API_TARGET,
					changeOrigin: true,
					secure: false,
					ws: true,
					configure: (proxy, _options) => {
						attachProxyLogging(proxy);
					}
				},
				'/p/weblate': {
					target:
						env.VITE_API_URL ||
						DEFAULT_API_TARGET,
					changeOrigin: true,
					secure: false,
					configure: (proxy, _options) => {
						attachProxyLogging(proxy);
					}
				},
				'/livereload': {
					target: 'ws://localhost:35729',
					ws: true
				}
			}
		},
		build: {
			outDir: 'build',
			sourcemap: true,
			// Generate multiple entry points
			rollupOptions: {
				input: {
					app: path.resolve(__dirname, 'index.html'),
					error: path.resolve(__dirname, 'error.html')
				}
			}
		},
		define: {
			// Make sure environment variables are available
			'process.env': {}
		},
		envPrefix: ['VITE_', 'FRONTEND_'],
		optimizeDeps: {
			esbuildOptions: {
				// Node.js global to browser globalThis
				define: {
					global: 'globalThis'
				}
			},
			include: [
				'draft-js',
				'draft-js-export-html',
				'markdown-draft-js',
				'@draft-js-plugins/editor',
				'@draft-js-plugins/emoji',
				'@draft-js-plugins/linkify',
				'@draft-js-plugins/static-toolbar',
				'@draft-js-plugins/buttons',
				'sanitize-html'
			]
		}
	};
});

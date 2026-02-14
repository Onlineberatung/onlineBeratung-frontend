import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { extensionsPlugin } from './vite-plugin-extensions';
import path from 'path';
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	const extensionDir = env.EXTENSION_DIR || './src/extensions';

	// Determine if we should use extensions
	const useExtensions = fs.existsSync(
		path.resolve(__dirname, extensionDir, 'initApp.tsx')
	);

	return {
		plugins: [
			// Extensions override plugin - must be first to intercept imports
			extensionsPlugin({
				extensionsDir: path.resolve(__dirname, extensionDir),
				srcDir: path.resolve(__dirname, './src')
			}),
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
					additionalData: `@import "${path.resolve(__dirname, './src/resources/styles/settings.scss')}";\n`,
					// Silence deprecation warnings that come from dependencies (breakpoint-sass, etc.)
					// These will be fixed when we migrate to @use/@forward or update dependencies
					silenceDeprecations: [
						'import',
						'legacy-js-api',
						'if-function',
						'global-builtin'
					]
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
						'https://happylife.develop.onlineberatung.net',
					changeOrigin: true,
					secure: false,
					ws: true, // Enable WebSocket support for /service/live/* endpoints
					configure: (proxy, _options) => {
						proxy.on('error', (err, _req, _res) => {
							console.log('proxy error', err);
						});
						proxy.on('proxyReq', (proxyReq, req, _res) => {
							console.log(
								'Sending Request to the Target:',
								req.method,
								req.url
							);
						});
						proxy.on('proxyRes', (proxyRes, req, _res) => {
							console.log(
								'Received Response from the Target:',
								proxyRes.statusCode,
								req.url
							);
						});
					}
				},
				'/api': {
					target:
						env.VITE_API_URL ||
						'https://happylife.develop.onlineberatung.net',
					changeOrigin: true,
					secure: false,
					configure: (proxy, _options) => {
						proxy.on('error', (err, _req, _res) => {
							console.log('proxy error', err);
						});
						proxy.on('proxyReq', (proxyReq, req, _res) => {
							console.log(
								'Sending Request to the Target:',
								req.method,
								req.url
							);
						});
						proxy.on('proxyRes', (proxyRes, req, _res) => {
							console.log(
								'Received Response from the Target:',
								proxyRes.statusCode,
								req.url
							);
						});
					}
				},
				'/auth': {
					target:
						env.VITE_API_URL ||
						'https://happylife.develop.onlineberatung.net',
					changeOrigin: true,
					secure: false,
					configure: (proxy, _options) => {
						proxy.on('error', (err, _req, _res) => {
							console.log('proxy error', err);
						});
						proxy.on('proxyReq', (proxyReq, req, _res) => {
							console.log(
								'Sending Request to the Target:',
								req.method,
								req.url
							);
						});
						proxy.on('proxyRes', (proxyRes, req, _res) => {
							console.log(
								'Received Response from the Target:',
								proxyRes.statusCode,
								req.url
							);
						});
					}
				},
				'/websocket': {
					target:
						env.VITE_API_URL ||
						'https://happylife.develop.onlineberatung.net',
					changeOrigin: true,
					secure: false,
					ws: true,
					configure: (proxy, _options) => {
						proxy.on('error', (err, _req, _res) => {
							console.log('WebSocket proxy error', err);
						});
						proxy.on('proxyReq', (proxyReq, req, _res) => {
							console.log(
								'WebSocket Request to Target:',
								req.method,
								req.url
							);
						});
						proxy.on('proxyRes', (proxyRes, req, _res) => {
							console.log(
								'WebSocket Response from Target:',
								proxyRes.statusCode,
								req.url
							);
						});
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
		envPrefix: 'VITE_',
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

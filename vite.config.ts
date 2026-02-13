import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
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
			react({
				// Use React 18's new JSX transform
				jsxRuntime: 'automatic'
			}),
			svgr({
				svgrOptions: {
					// Export React component as default
					exportType: 'default',
					ref: true,
					svgo: false,
					titleProp: true
				},
				include: '**/*.svg'
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
					additionalData: `@import "./src/resources/styles/settings.scss";\n`
				}
			}
		},
		server: {
			port: 5173,
			host: true,
			proxy: {
				'/service': {
					target: env.VITE_API_URL || 'http://localhost:8080',
					changeOrigin: true,
					secure: false
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
				'@draft-js-plugins/buttons'
			]
		}
	};
});

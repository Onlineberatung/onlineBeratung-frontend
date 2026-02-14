import { Plugin } from 'vite';
import path from 'path';
import fs from 'fs';

interface ExtensionsPluginOptions {
	extensionsDir: string;
	srcDir: string;
}

/**
 * Vite plugin to support file overrides via extensions directory.
 *
 * This plugin allows files in the extensions directory to override
 * files in the src directory. For example:
 * - src/extensions/components/login/Login.tsx overrides
 * - src/components/login/Login.tsx
 *
 * This mimics the behavior of webpack's NormalModuleReplacementPlugin
 * that was used in the original configuration.
 */
export function extensionsPlugin(options: ExtensionsPluginOptions): Plugin {
	const { extensionsDir, srcDir } = options;

	// File extensions to check, in order of priority
	const extensions = ['.tsx', '.ts', '.jsx', '.js', '.scss', '.css', '.html'];

	return {
		name: 'vite-plugin-extensions',
		enforce: 'pre', // Run before other plugins

		resolveId(source, importer) {
			// Only process if we have an importer (not entry points)
			if (!importer) {
				return null;
			}

			// Skip if the importer is from extensions directory
			// This prevents circular dependencies when extensions import from src
			if (importer.startsWith(extensionsDir) || importer.includes('/extensions/')) {
				return null;
			}

			// Only process relative or absolute imports from src directory
			if (
				!source.startsWith('./') &&
				!source.startsWith('../') &&
				!source.startsWith('/')
			) {
				return null;
			}

			// Resolve the full path of what would be imported
			const resolvedPath = path.resolve(path.dirname(importer), source);

			// Check if this is importing from src directory
			if (!resolvedPath.startsWith(srcDir)) {
				return null;
			}

			// Skip if already importing from extensions directory
			// This prevents trying to override files that are already extensions
			if (resolvedPath.startsWith(extensionsDir) || resolvedPath.includes('/extensions/')) {
				return null;
			}

			// Calculate the potential extension override path
			const relativePath = path.relative(srcDir, resolvedPath);
			const extensionBasePath = path.join(extensionsDir, relativePath);

			// Try to find a matching file with extension in the extensions directory
			for (const ext of extensions) {
				const extensionPath = extensionBasePath + ext;

				try {
					if (
						fs.existsSync(extensionPath) &&
						fs.lstatSync(extensionPath).isFile()
					) {
						console.log(
							`✓ Extension override: ${path.relative(process.cwd(), resolvedPath)} -> ${path.relative(process.cwd(), extensionPath)}`
						);
						return extensionPath;
					}
				} catch (err) {
					// File doesn't exist or error checking, continue
				}
			}

			// Also check if the import already has an extension
			try {
				if (
					fs.existsSync(extensionBasePath) &&
					fs.lstatSync(extensionBasePath).isFile()
				) {
					console.log(
						`✓ Extension override: ${path.relative(process.cwd(), resolvedPath)} -> ${path.relative(process.cwd(), extensionBasePath)}`
					);
					return extensionBasePath;
				}
			} catch (err) {
				// File doesn't exist or error checking
			}

			// No override found, return null to continue normal resolution
			return null;
		}
	};
}

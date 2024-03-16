import type { StorybookConfig } from '@storybook/react-webpack5';
import * as webpackConfigFactory from '../config/webpack.config';
import { Configuration } from 'webpack';

const config: StorybookConfig = {
	stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
	addons: [
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		'@storybook/addon-interactions',
		'storybook-react-i18next'
	],
	framework: {
		name: '@storybook/react-webpack5',
		options: {}
	},
	webpackFinal: async (config, { configType }) => {
		// @ts-ignore
		const webpackConfig = webpackConfigFactory.default(
			configType.toLowerCase()
		);

		return {
			...config,
			resolve: {
				...config.resolve,
				modules: [
					...webpackConfig.resolve.modules,
					...config.resolve.modules
				],
				extensions: [
					...webpackConfig.resolve.extensions,
					...config.resolve.extensions
				],
				alias: {
					...webpackConfig.resolve.alias,
					...config.resolve.alias
				},
				plugins: [...webpackConfig.resolve.plugins]
			},
			plugins: [...webpackConfig.plugins, ...config.plugins],
			module: {
				...config.module,
				rules: [
					// Exclude svg from storybook file-loader
					...config.module.rules.map((r: any) => {
						if (r.test && /svg/.test(r.test)) {
							// Silence the Storybook loaders for SVG files
							return { ...r, exclude: /\.svg$/i };
						}
						return r;
					}),
					// Filter the last catch all because storybook needs to handle mjs files
					...webpackConfig.module.rules.map((r) => {
						if (!r.oneOf) {
							return r;
						}
						return {
							...r,
							oneOf: r.oneOf.filter(
								(o) => o.type !== 'asset/resource'
							)
						};
					})
				]
			}
		} as Configuration;
	},
	docs: {
		autodocs: 'tag'
	}
};
export default config;

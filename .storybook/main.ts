import type { StorybookConfig } from '@storybook/react-webpack5';
const config: StorybookConfig = {
	stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
	addons: [
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		'@storybook/addon-interactions',
		'storybook-react-i18next',
		{
			name: '@storybook/addon-styling',
			options: {
				sass: {
					implementation: require('sass')
				}
			}
		}
	],
	framework: {
		name: '@storybook/react-webpack5',
		options: {}
	},
	docs: {
		autodocs: 'tag'
	}
};
export default config;

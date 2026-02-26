import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import cypress from 'eslint-plugin-cypress';
import compat from 'eslint-plugin-compat';
import { fixupPluginRules } from '@eslint/compat';
import globals from 'globals';

export default [
	{
		ignores: [
			'**/node_modules/**',
			'**/build/**',
			'**/dist/**',
			'**/cypress/videos/**',
			'**/cypress/screenshots/**',
			'**/test-results/**',
			'**/*.min.js'
		]
	},
	js.configs.recommended,
	compat.configs['flat/recommended'],
	{
		files: ['**/*.{js,jsx,ts,tsx}'],
		languageOptions: {
			ecmaVersion: 2024,
			sourceType: 'module',
			parser: tsparser,
			parserOptions: {
				ecmaFeatures: {
					jsx: true
				}
			},
			globals: {
				...globals.browser,
				...globals.es2024,
				...globals.node
			}
		},
		plugins: {
			'@typescript-eslint': tseslint,
			'react': react,
			'react-hooks': fixupPluginRules(reactHooks),
			'jsx-a11y': jsxA11y,
			'import': fixupPluginRules(importPlugin),
			'cypress': cypress
		},
		settings: {
			react: {
				version: 'detect'
			},
			'import/resolver': {
				typescript: {},
				node: {
					extensions: ['.js', '.jsx', '.ts', '.tsx']
				}
			}
		},
		rules: {
			...tseslint.configs.recommended.rules,
			...react.configs.recommended.rules,
			...reactHooks.configs.recommended.rules,
			...jsxA11y.configs.recommended.rules,
			...importPlugin.configs.recommended.rules,
			...importPlugin.configs.typescript.rules,
			...cypress.configs.recommended.rules,
			'react/react-in-jsx-scope': 'off',
			'react/prop-types': 'off',
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/explicit-module-boundary-types': 'off',
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_'
				}
			],
			'no-console': 'off'
		}
	},
	{
		files: ['**/*.spec.ts'],
		rules: {
			'@typescript-eslint/no-unused-expressions': 'off'
		}
	},
	{
		files: ['proxy/**/*.js'],
		rules: {
			'strict': 'off'
		}
	}
];

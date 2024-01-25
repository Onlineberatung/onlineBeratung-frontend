module.exports = {
	plugins: ['stylelint-scss', 'stylelint-no-unsupported-browser-features'],
	extends: ['stylelint-config-standard', 'stylelint-config-standard-scss'],
	rules: {
		'selector-max-id': 0,
		'scss/dollar-variable-colon-space-after': 'always-single-line',
		'scss/dollar-variable-colon-space-before': 'never',
		'plugin/no-unsupported-browser-features': [
			true,
			{
				browsers: ['> 2% and Last 2 versions'],
				severity: 'warning',
				ignore: [
					// Works good enough in the supported browsers
					'calc',
					'flexbox',
					'css-gradients',
					'multicolumn',
					'css-masks',
					// Progressive enhancement
					'text-size-adjust',
					'viewport-units',
					'css-appearance',
					'word-break',
					'css-unset-value',
					'css-filters',
					'outline',
					'css3-cursors',
					'css-resize',
					'intrinsic-width',
					'css-nesting',
					'css-when-else',
					'css-selection'
				]
			}
		],
		'rule-empty-line-before': [
			'always-multi-line',
			{
				except: ['after-single-line-comment', 'first-nested']
			}
		],

		// Defaults are not good
		'alpha-value-notation': 'number',
		'color-function-notation': 'legacy',
		'value-keyword-case': null, // Requires e.g. "robotoslab" instead of "RobotoSlab"
		'scss/operator-no-unspaced': null, // Has false positives
		'scss/dollar-variable-empty-line-before': null,
		'scss/at-import-partial-extension': null, // We use the `.styles.scss` extension
		'scss/operator-no-newline-after': null, // Conflicts with prettier

		// Too much effort to change
		'selector-class-pattern': null,

		// TODO: Only disabled temporarily to compile this list, but should be fixed
		'scss/dollar-variable-pattern': null, // Likely requires changes in lib consumer
		'scss/at-mixin-argumentless-call-parentheses': null,
		'color-hex-length': null,
		'scss/double-slash-comment-whitespace-inside': null,
		'selector-pseudo-element-colon-notation': null,
		'property-no-vendor-prefix': null,
		'length-zero-no-unit': null,
		'declaration-empty-line-before': null,
		'rule-empty-line-before': null,
		'keyframes-name-pattern': null,
		'no-descending-specificity': null,
		'declaration-block-no-shorthand-property-overrides': null,
		'declaration-no-important': null,
		'scss/no-global-function-names': null,
		'no-duplicate-selectors': null,
		'declaration-block-no-redundant-longhand-properties': null,
		'selector-no-vendor-prefix': null,
		'value-no-vendor-prefix': null,
		'shorthand-property-no-redundant-values': null,
		'declaration-block-no-duplicate-properties': null,
		'selector-pseudo-class-no-unknown': [
			true,
			{
				ignorePseudoClasses: ['global']
			}
		]
	}
};

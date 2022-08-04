export const VALIDITY_INITIAL = 'initial';
export const VALIDITY_VALID = 'valid';
export const VALIDITY_INVALID = 'invalid';

export type AccordionItemValidity =
	| typeof VALIDITY_INITIAL
	| typeof VALIDITY_VALID
	| typeof VALIDITY_INVALID;

export const MIN_USERNAME_LENGTH = 5;

export const isStringValidEmail = (email: string) =>
	/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
		email
	);

export const getOptionOfSelectedValue = (inputOptions, selectedValue) => {
	return inputOptions.filter((item) => item.value === selectedValue)[0];
};

export const getValidationClassNames = (invalid, valid) => {
	if (invalid) {
		return 'inputField__input--invalid';
	}
	if (valid) {
		return 'inputField__input--valid';
	}
	return '';
};

export type RegistrationDropdownSelectData = {
	label: string;
	options: Array<{ value: string; label: string }>;
};

export const stateData = [
	{
		value: '1',
		label: 'registration.state.options.1'
	},
	{
		value: '2',
		label: 'registration.state.options.2'
	},
	{
		value: '3',
		label: 'registration.state.options.3'
	},
	{
		value: '4',
		label: 'registration.state.options.4'
	},
	{
		value: '5',
		label: 'registration.state.options.5'
	},
	{
		value: '6',
		label: 'registration.state.options.6'
	},
	{
		value: '7',
		label: 'registration.state.options.7'
	},
	{
		value: '8',
		label: 'registration.state.options.8'
	},
	{
		value: '9',
		label: 'registration.state.options.9'
	},
	{
		value: '10',
		label: 'registration.state.options.10'
	},
	{
		value: '11',
		label: 'registration.state.options.11'
	},
	{
		value: '12',
		label: 'registration.state.options.12'
	},
	{
		value: '13',
		label: 'registration.state.options.13'
	},
	{
		value: '14',
		label: 'registration.state.options.14'
	},
	{
		value: '15',
		label: 'registration.state.options.15'
	},
	{
		value: '16',
		label: 'registration.state.options.16'
	},
	{
		value: '0',
		label: 'registration.state.options.0'
	}
];

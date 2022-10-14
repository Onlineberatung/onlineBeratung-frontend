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

export const VALIDITY_INITIAL = 'initial';
export const VALIDITY_VALID = 'valid';
export const VALIDITY_INVALID = 'invalid';

export type AccordionItemValidity =
	| typeof VALIDITY_INITIAL
	| typeof VALIDITY_VALID
	| typeof VALIDITY_INVALID;

export const isStringValidEmail = (email: string) =>
	/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
		email
	);

// minimum 5 characters, no spaces
export const isStringValidUsername = (username: string) =>
	/^(?!.*\s).{5,}$/.test(username);

export type RegistrationDropdownSelectData = {
	label: string;
	options: Array<{ value: string; label: string }>;
};

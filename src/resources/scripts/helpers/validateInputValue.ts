const hasNumber = (value: string) => {
	return new RegExp(/[0-9]/).test(value);
};

const hasMixedLetters = (value: string) => {
	return new RegExp(/[a-z]/).test(value) && new RegExp(/[A-Z]/).test(value);
};

const hasSpecialChar = (value: string) => {
	return new RegExp(/[^\p{Lu}\p{Lt}\p{Ll}\p{Lm}\p{Lo}\p{Nd}]/gu).test(value);
};

export const strengthColor = (count: number) => {
	if (count < 4) return 'red';

	if (count >= 4) return 'green';
};

export const strengthIndicator = (value: string) => {
	let passwordStrength: number = 0;

	if (value.length > 8) passwordStrength++;

	if (hasNumber(value)) passwordStrength++;

	if (hasMixedLetters(value)) passwordStrength++;

	if (hasSpecialChar(value)) passwordStrength++;

	return passwordStrength;
};

export type passwordCriteria = {
	hasUpperLowerCase: boolean;
	hasNumber: boolean;
	hasSpecialChar: boolean;
	hasMinLength: boolean;
};

export const validatePasswordCriteria = (value: string) => {
	const passwordValidationParams: passwordCriteria = {
		hasUpperLowerCase: false,
		hasNumber: false,
		hasSpecialChar: false,
		hasMinLength: false
	};

	if (hasMixedLetters(value))
		passwordValidationParams.hasUpperLowerCase = true;
	if (hasNumber(value)) passwordValidationParams.hasNumber = true;
	if (hasSpecialChar(value)) passwordValidationParams.hasSpecialChar = true;
	if (value.length > 8) passwordValidationParams.hasMinLength = true;

	return passwordValidationParams;
};

export const inputValuesFit = (firstValue: string, secondValue: string) => {
	if (firstValue === secondValue) return true;

	return false;
};

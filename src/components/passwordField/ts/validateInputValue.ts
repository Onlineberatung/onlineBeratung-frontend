const hasNumber = (value: string) => {
	return new RegExp(/[0-9]/).test(value);
};

const hasMixedLetters = (value: string) => {
	return new RegExp(/[a-z]/).test(value) && new RegExp(/[A-Z]/).test(value);
};

const hasSpecialChar = (value: string) => {
	return new RegExp(/[^a-zA-Z0-9]/).test(value);
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

export const inputValuesFit = (firstValue: string, secondValue: string) => {
	if (firstValue === secondValue) return true;

	return false;
};

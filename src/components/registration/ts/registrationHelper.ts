export const MIN_USERNAME_LENGTH = 5;

export const isStringValidEmail = (email: string) =>
	/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
		email
	);

export const getOptionOfSelectedValue = (inputOptions, selectedValue) => {
	return inputOptions.filter((item) => item.value === selectedValue)[0];
};

export const extendPostcodeToBeValid = (postcode: string) =>
	String(postcode + '00').slice(0, 5);

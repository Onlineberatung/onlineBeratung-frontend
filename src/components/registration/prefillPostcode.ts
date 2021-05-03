export const DEFAULT_POSTCODE = '00000';

export const redirectToRegistrationWithoutAid = () => {
	const url = window.location.href;
	window.location.href = url.split('?')[0];
};

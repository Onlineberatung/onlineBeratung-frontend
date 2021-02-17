import { config } from '../../resources/scripts/config';

export const DEFAULT_POSTCODE = '00000';

export const redirectToRegistrationWithoutAid = () => {
	const url = window.location.href;
	window.location.href = url.split('?')[0];
};

export const redirectToHelpmail = () => {
	window.location.href = config.urls.toU25Helpmail;
};

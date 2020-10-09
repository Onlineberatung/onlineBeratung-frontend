import { config } from '../../../resources/ts/config';

export interface AgencyDataProps {
	postcode?: string;
	name?: string;
	teamAgency?: boolean;
	description?: string;
}

export const DEFAULT_POSTCODE = '00000';

export const redirectToRegistrationWithoutAid = () => {
	const url = window.location.href;
	window.location.href = url.split('?')[0];
};

export const redirectToHelpmail = () => {
	window.location.href = config.endpoints.registrationHelpmailRedirect;
};

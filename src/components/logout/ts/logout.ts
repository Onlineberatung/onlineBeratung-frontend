import { config } from '../../../resources/ts/config';
import { removeAllCookies } from '../../sessionCookie/ts/accessSessionCookie';
import { rocketchatLogout } from '../../apiWrapper/ts/';
import { keycloakLogout } from '../../apiWrapper/ts/';

let isRequestInProgress = false;
export const logout = (redirectUrl?: string) => {
	if (isRequestInProgress) {
		return null;
	}
	isRequestInProgress = true;
	rocketchatLogout()
		.then((response) => {
			keycloakLogout()
				.then((response) => {
					invalidateCookies(redirectUrl);
				})
				.catch((error) => {
					invalidateCookies(redirectUrl);
				});
		})
		.catch((error) => {
			invalidateCookies(redirectUrl);
		});
};

const invalidateCookies = (redirectUrl?: string) => {
	removeAllCookies();
	redirectAfterLogout(redirectUrl);
};

const redirectAfterLogout = (altRedirectUrl?: string) => {
	const redirectUrl = altRedirectUrl
		? altRedirectUrl
		: config.endpoints.logoutRedirect;
	setTimeout(() => {
		window.location.href = redirectUrl;
	}, 1000);
};

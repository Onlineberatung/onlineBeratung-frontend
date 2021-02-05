import { config } from '../../resources/scripts/config';
import { removeAllCookies } from '../sessionCookie/accessSessionCookie';
import { apiRocketchatLogout, apiKeycloakLogout } from '../../api';
import { removeTokenExpiryFromLocalStorage } from '../sessionCookie/accessSessionLocalStorage';

let isRequestInProgress = false;
export const logout = (withRedirect: boolean = true, redirectUrl?: string) => {
	if (isRequestInProgress) {
		return null;
	}
	isRequestInProgress = true;
	apiRocketchatLogout()
		.then((response) => {
			apiKeycloakLogout()
				.then((response) => {
					invalidateCookies(withRedirect, redirectUrl);
				})
				.catch((error) => {
					invalidateCookies(withRedirect, redirectUrl);
				});
		})
		.catch((error) => {
			invalidateCookies(withRedirect, redirectUrl);
		});
};

const invalidateCookies = (
	withRedirect: boolean = true,
	redirectUrl?: string
) => {
	removeAllCookies();
	removeTokenExpiryFromLocalStorage();
	if (withRedirect) {
		redirectAfterLogout(redirectUrl);
	}
};

const redirectAfterLogout = (altRedirectUrl?: string) => {
	const redirectUrl = altRedirectUrl
		? altRedirectUrl
		: config.urls.logoutRedirect;
	setTimeout(() => {
		window.location.href = redirectUrl;
	}, 1000);
};

import { config } from '../../resources/scripts/config';
import { removeAllCookies } from '../sessionCookie/accessSessionCookie';
import { apiRocketchatLogout, apiKeycloakLogout } from '../../api';
import { removeTokenExpiryFromLocalStorage } from '../sessionCookie/accessSessionLocalStorage';
import getLocationVariables from '../../utils/getLocationVariables';

let isRequestInProgress = false;
export const logout = (withRedirect: boolean = true, redirectUrl?: string) => {
	if (isRequestInProgress) {
		return null;
	}
	isRequestInProgress = true;
	apiRocketchatLogout()
		.then(() => {
			apiKeycloakLogout()
				.then(() => {
					invalidateCookies(withRedirect, redirectUrl);
				})
				.catch(() => {
					invalidateCookies(withRedirect, redirectUrl);
				});
		})
		.catch(() => {
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
	const { subdomain, origin } = getLocationVariables();

	let redirectUrl = altRedirectUrl ? altRedirectUrl : config.urls.toEntry;
	if (subdomain) {
		redirectUrl = origin;
	}
	setTimeout(() => {
		window.location.href = redirectUrl;
	}, 1000);
};

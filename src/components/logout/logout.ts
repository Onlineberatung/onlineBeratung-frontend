import { apiKeycloakLogout } from '../../api/apiLogoutKeycloak';
import { apiRocketchatLogout } from '../../api/apiLogoutRocketchat';
import { config } from '../../resources/scripts/config';
import { removeAllCookies } from '../sessionCookie/accessSessionCookie';
import { removeTokenExpiryFromLocalStorage } from '../sessionCookie/accessSessionLocalStorage';
import { callEventListeners } from '../../utils/eventHandler';

export const EVENT_PRE_LOGOUT = 'pre_logout';

let isRequestInProgress = false;
export const logout = async (
	withRedirect: boolean = true,
	redirectUrl?: string
) => {
	if (isRequestInProgress) {
		return null;
	}

	if (await callEventListeners(EVENT_PRE_LOGOUT)) {
		return;
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
	const redirectUrl = altRedirectUrl ? altRedirectUrl : config.urls.toEntry;
	setTimeout(() => {
		window.location.href = redirectUrl;
	}, 1000);
};

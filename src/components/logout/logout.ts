import { config } from '../../resources/scripts/config';
import { removeAllCookies } from '../sessionCookie/accessSessionCookie';
import { rocketchatLogout } from '../apiWrapper';
import { keycloakLogout } from '../apiWrapper';

let isRequestInProgress = false;
export const logout = (withRedirect: boolean = true, redirectUrl?: string) => {
	if (isRequestInProgress) {
		return null;
	}
	isRequestInProgress = true;
	rocketchatLogout()
		.then((response) => {
			keycloakLogout()
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
	if (withRedirect) {
		redirectAfterLogout(redirectUrl);
	}
};

const redirectAfterLogout = (altRedirectUrl?: string) => {
	const redirectUrl = altRedirectUrl
		? altRedirectUrl
		: config.endpoints.logoutRedirect;
	setTimeout(() => {
		window.location.href = redirectUrl;
	}, 1000);
};

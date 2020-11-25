import { logout } from '../logout/logout';
import { LoginData } from '../registration/autoLogin';
import { setTokenInCookie } from '../sessionCookie/accessSessionCookie';
import {
	getTokenExpiryFromLocalStorage,
	setAccessTokenExpiryInLocalStorage,
	setRefreshTokenExpiryInLocalStorage
} from '../sessionCookie/accessSessionLocalStorage';
import { refreshKeycloakAccessToken } from '../sessionCookie/refreshKeycloakAccessToken';

export const RENEW_BEFORE_EXPIRY_TIME = 10 * 1000; // seconds

export const setTokens = (data: LoginData) => {
	if (data.access_token) {
		setTokenInCookie('keycloak', data.access_token);
		setAccessTokenExpiryInLocalStorage(data.expires_in);
	}
	if (data.refresh_token) {
		setTokenInCookie('refreshToken', data.refresh_token);
		setRefreshTokenExpiryInLocalStorage(data.refresh_expires_in);
	}
};

const refreshTokens = (): Promise<void> => {
	const currentTime = new Date().getTime();
	const tokenExpiry = getTokenExpiryFromLocalStorage();

	if (
		tokenExpiry.refreshValidUntil <=
		currentTime - RENEW_BEFORE_EXPIRY_TIME
	) {
		logout(true);
		return Promise.resolve();
	}

	return refreshKeycloakAccessToken().then((response) => {
		setTokens(response);
	});
};

const startTimers = (
	tokenValidMs: number,
	tokenRefreshExpiredTimeout: number
) => {
	const tokenRefreshAccessTokenInterval =
		tokenValidMs - RENEW_BEFORE_EXPIRY_TIME;

	let refreshInterval;
	if (tokenRefreshAccessTokenInterval > 0) {
		refreshInterval = window.setInterval(() => {
			refreshTokens();
		}, tokenRefreshAccessTokenInterval);
	}

	if (tokenValidMs <= tokenRefreshExpiredTimeout) {
		window.setTimeout(() => {
			if (refreshInterval) {
				window.clearInterval(refreshInterval);
			}

			logout(true);
		}, tokenRefreshExpiredTimeout);
	}
};

export const handleTokenRefresh = (): Promise<void> => {
	return new Promise((resolve) => {
		const currentTime = new Date().getTime();
		const tokenExpiry = getTokenExpiryFromLocalStorage();
		const tokenValidMs = tokenExpiry.validUntil - currentTime;

		const tokenRefreshExpiredTimeout =
			tokenExpiry.refreshValidUntil - currentTime;

		if (tokenRefreshExpiredTimeout <= 0) {
			logout(true);
			resolve();
		} else if (tokenValidMs <= 0) {
			refreshTokens().then(() => {
				startTimers(tokenValidMs, tokenRefreshExpiredTimeout);
				resolve();
			});
		} else {
			startTimers(tokenValidMs, tokenRefreshExpiredTimeout);
			resolve();
		}
	});
};

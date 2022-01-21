import { getKeycloakAccessToken } from '../sessionCookie/getKeycloakAccessToken';
import { getRocketchatAccessToken } from '../sessionCookie/getRocketchatAccessToken';
import { setValueInCookie } from '../sessionCookie/accessSessionCookie';
import { APP_PATH, config } from '../../resources/scripts/config';
import { generateCsrfToken } from '../../utils/generateCsrfToken';
import { encodeUsername } from '../../utils/encryptionHelpers';
import { setTokens } from '../auth/auth';
import { FETCH_ERRORS } from '../../api';

export interface LoginData {
	data: {
		authToken?: string;
		userId?: string;
	};
	access_token?: string;
	expires_in?: number;
	refresh_token?: string;
	refresh_expires_in?: number;
}

export const autoLogin = (autoLoginProps: {
	username: string;
	password: string;
	redirect: boolean;
	redirectURL?: string;
	handleLoginSuccess?: Function;
	otp?: string;
	useOldUser?: boolean;
}): Promise<any> =>
	new Promise((resolve, reject) => {
		const userHash = autoLoginProps.useOldUser
			? autoLoginProps.username
			: encodeUsername(autoLoginProps.username);
		getKeycloakAccessToken(
			autoLoginProps.useOldUser ? encodeURIComponent(userHash) : userHash,
			encodeURIComponent(autoLoginProps.password),
			autoLoginProps.otp ? autoLoginProps.otp : null
		)
			.then((response) => {
				setTokens(
					response.access_token,
					response.expires_in,
					response.refresh_token,
					response.refresh_expires_in
				);

				getRocketchatAccessToken(userHash, autoLoginProps.password)
					.then((response) => {
						const data = response.data;
						if (data.authToken) {
							setValueInCookie('rc_token', data.authToken);
						}
						if (data.userId) {
							setValueInCookie('rc_uid', data.userId);
						}

						//generate new csrf token for current session
						generateCsrfToken(true);
						if (autoLoginProps.redirect) {
							redirectToApp(autoLoginProps.redirectURL);
						}

						if (autoLoginProps.handleLoginSuccess) {
							autoLoginProps.handleLoginSuccess();
						}
					})
					.catch((error) => {
						reject(error);
					});
			})
			.catch((error) => {
				if (
					!autoLoginProps.useOldUser &&
					error.message === FETCH_ERRORS.UNAUTHORIZED
				) {
					autoLogin({
						username: autoLoginProps.username,
						password: autoLoginProps.password,
						redirectURL: autoLoginProps.redirectURL,
						redirect: autoLoginProps.redirect,
						otp: autoLoginProps.otp,
						useOldUser: true
					}).catch((error) => reject(error));
				} else {
					reject(error);
				}
			});
	});

export const redirectToApp = (redirectURL?: string) => {
	window.location.href = redirectURL
		? redirectURL + '/' + APP_PATH
		: config.urls.redirectToApp;
};

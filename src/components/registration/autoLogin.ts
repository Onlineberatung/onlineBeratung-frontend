import { getKeycloakAccessToken } from '../sessionCookie/getKeycloakAccessToken';
import { getRocketchatAccessToken } from '../sessionCookie/getRocketchatAccessToken';
import { setTokenInCookie } from '../sessionCookie/accessSessionCookie';
import { config } from '../../resources/scripts/config';
import { generateCsrfToken } from '../../utils/generateCsrfToken';
import { encodeUsername } from '../../utils/encryptionHelpers';
import { setTokens } from '../auth/auth';

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
	handleLoginError?: Function;
	handleLoginSuccess?: Function;
	useOldUser?: boolean;
}) => {
	const userHash = autoLoginProps.useOldUser
		? autoLoginProps.username
		: encodeUsername(autoLoginProps.username);
	getKeycloakAccessToken(
		autoLoginProps.useOldUser ? encodeURIComponent(userHash) : userHash,
		encodeURIComponent(autoLoginProps.password)
	)
		.then((response) => {
			setTokens(response);

			getRocketchatAccessToken(userHash, autoLoginProps.password)
				.then((response) => {
					const data = response.data;
					if (data.authToken) {
						setTokenInCookie('rc_token', data.authToken);
					}
					if (data.userId) {
						setTokenInCookie('rc_uid', data.userId);
					}

					//generate new csrf token for current session
					generateCsrfToken(true);
					if (autoLoginProps.redirect) {
						redirectToApp();
					}

					if (autoLoginProps.handleLoginSuccess) {
						autoLoginProps.handleLoginSuccess();
					}
				})
				.catch((error) => {
					if (autoLoginProps.handleLoginError) {
						autoLoginProps.handleLoginError();
					} else {
						console.error(error);
					}
				});
		})
		.catch((error) => {
			if (autoLoginProps.useOldUser) {
				autoLoginProps.handleLoginError
					? autoLoginProps.handleLoginError()
					: console.error(error);
			} else {
				autoLogin({
					username: autoLoginProps.username,
					password: autoLoginProps.password,
					redirect: autoLoginProps.redirect,
					handleLoginError: autoLoginProps.handleLoginError,
					useOldUser: true
				});
			}
		});
};

export const redirectToApp = () => {
	window.location.href = config.urls.redirectToApp;
};

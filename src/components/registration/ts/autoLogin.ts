import { getKeycloakAccessToken } from '../../sessionCookie/getKeycloakAccessToken';
import { getRocketchatAccessToken } from '../../sessionCookie/getRocketchatAccessToken';
import { setTokenInCookie } from '../../sessionCookie/accessSessionCookie';
import { config } from '../../../resources/scripts/config';
import { generateCsrfToken } from '../../../resources/scripts/helpers/generateCsrfToken';
import { encodeUsername } from '../../../resources/scripts/helpers/encryptionHelpers';

export interface LoginData {
	data: {
		authToken?: string;
		userId?: string;
	};
	access_token?: string;
	refresh_token?: string;
}

export const autoLogin = (
	username: string,
	password: string,
	redirect: boolean,
	handleLoginError?: Function,
	useOldUser?: boolean
) => {
	const userHash = useOldUser ? username : encodeUsername(username);
	getKeycloakAccessToken(
		useOldUser ? encodeURIComponent(userHash) : userHash,
		encodeURIComponent(password)
	)
		.then((response) => {
			if (response.access_token) {
				setTokenInCookie('keycloak', response.access_token);
			}
			if (response.refresh_token) {
				setTokenInCookie('refreshToken', response.refresh_token);
			}

			getRocketchatAccessToken(userHash, password)
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
					if (redirect) {
						redirectToApp();
					}
					// redirect ? redirectToApp() : null;
				})
				.catch((error) => {
					if (handleLoginError) {
						handleLoginError();
					} else {
						console.error(error);
					}
				});
		})
		.catch((error) => {
			if (useOldUser) {
				handleLoginError 
					? handleLoginError() 
					: console.error(error);
			} else {
				autoLogin(
					username,
					password,
					redirect,
					handleLoginError,
					true
				);
			}
		});
};

export const redirectToApp = () => {
	window.location.href = config.endpoints.redirectToApp;
};

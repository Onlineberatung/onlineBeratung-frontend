import { getKeycloakAccessToken } from '../../sessionCookie/ts/getKeycloakAccessToken';
import { getRocketchatAccessToken } from '../../sessionCookie/ts/getRocketchatAccessToken';
import { setTokenInCookie } from '../../sessionCookie/ts/accessSessionCookie';
import { handleLoginError } from '../../loginFormular/ts/handleLogin';
import { config } from '../../../resources/ts/config';
import { generateCsrfToken } from '../../../resources/ts/helpers/generateCsrfToken';
import { encodeUsername } from '../../../resources/ts/helpers/encryptionHelpers';

export const autoLogin = (
	username: string,
	password: string,
	redirect: boolean,
	useOldUser: boolean = false
) => {
	const userHash = useOldUser ? username : encodeUsername(username);
	getKeycloakAccessToken(
		useOldUser ? encodeURIComponent(userHash) : userHash,
		encodeURIComponent(password)
	)
		.then((response) => {
			setTokenInCookie('keycloak', response.access_token);
			setTokenInCookie('refreshToken', response.refresh_token);

			getRocketchatAccessToken(userHash, password)
				.then((response) => {
					const data = response.data;
					setTokenInCookie('rc_token', data.authToken);
					setTokenInCookie('rc_uid', data.userId);

					//generate new csrf token for current session
					generateCsrfToken(true);
					redirect ? redirectToApp() : null;
				})
				.catch(() => {
					handleLoginError();
				});
		})
		.catch((error) => {
			useOldUser
				? handleLoginError()
				: autoLogin(username, password, redirect, true);
		});
};

export const redirectToApp = () => {
	window.location.href = config.endpoints.redirectToApp;
};

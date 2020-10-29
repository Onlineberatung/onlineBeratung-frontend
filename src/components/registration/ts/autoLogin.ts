import { getKeycloakAccessToken } from '../../sessionCookie/ts/getKeycloakAccessToken';
import { getRocketchatAccessToken } from '../../sessionCookie/ts/getRocketchatAccessToken';
import { setTokenInCookie } from '../../sessionCookie/ts/accessSessionCookie';
import { config } from '../../../resources/ts/config';
import { generateCsrfToken } from '../../../resources/ts/helpers/generateCsrfToken';
import { encodeUsername } from '../../../resources/ts/helpers/encryptionHelpers';

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
			setTokenInCookie('keycloak', response.access_token);
			setTokenInCookie('refreshToken', response.refresh_token);

			getRocketchatAccessToken(userHash, password)
				.then((response) => {
					const data = response.data;
					setTokenInCookie('rc_token', data.authToken);
					setTokenInCookie('rc_uid', data.userId);

					//generate new csrf token for current session
					generateCsrfToken(true);
					if (redirect) {
						redirectToApp();
					}
					// redirect ? redirectToApp() : null;
				})
				.catch(() => {
					handleLoginError();
				});
		})
		.catch((error) => {
			useOldUser
				? handleLoginError()
				: autoLogin(
						username,
						password,
						redirect,
						handleLoginError,
						true
				  );
		});
};

export const redirectToApp = () => {
	window.location.href = config.endpoints.redirectToApp;
};

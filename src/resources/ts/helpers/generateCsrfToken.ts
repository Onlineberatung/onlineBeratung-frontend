import { getTokenFromCookie } from '../../../components/sessionCookie/ts/accessSessionCookie';

export const generateCsrfToken = (refreshToken: boolean = false) => {
	const currentToken = getTokenFromCookie('CSRF-TOKEN');
	//only refresh if necessary to avoid errors on asnyc functionality
	if (!currentToken || refreshToken) {
		let token = '';
		const possible =
			'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

		for (var i = 0; i < 18; i++) {
			token += possible.charAt(
				Math.floor(Math.random() * possible.length)
			);
		}

		setTokenToCookie(token);
		return token;
	} else {
		return currentToken;
	}
};

const setTokenToCookie = (token: string) => {
	document.cookie = 'CSRF-TOKEN=' + token + ';path=/';
};

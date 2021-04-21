import {
	getTokenFromCookie,
	setTokenInCookie
} from '../components/sessionCookie/accessSessionCookie';

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

		setTokenInCookie('CSRF-TOKEN', token);
		return token;
	} else {
		return currentToken;
	}
};

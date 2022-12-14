export const setValueInCookie = (
	name: string,
	value: string,
	path: string = '/'
) => {
	document.cookie = `${name}=${value};path=${path};`;
};

export const deleteCookieByName = (name: string, path: string = '/') => {
	document.cookie = `${name}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

export const getValueFromCookie = (targetValue: string) => {
	const targetName = targetValue + '=';
	const decodedCookie = decodeURIComponent(document.cookie);

	const ca = decodedCookie.split(';');

	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) === ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(targetName) === 0) {
			return c.substring(targetName.length, c.length);
		}
	}
	return '';
};

export const removeAllCookies = (allowlist = []) => {
	document.cookie.split(';').forEach(function (c) {
		const name = c.trim().split('=')[0];
		if (
			[
				...allowlist,
				...(process.env.REACT_APP_COOKIES_ALLOWEDLIST ?? '').split(',')
			].includes(name)
		)
			return;

		document.cookie =
			name + '=;path=/; expires=Thu, 27 May 1992 08:32:00 MET;';
	});
};

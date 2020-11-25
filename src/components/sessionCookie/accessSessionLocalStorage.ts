export type LocalStorageKey = 'auth.valid_until' | 'auth.refresh_valid_until';

export const getLocalStorageItem = (key: LocalStorageKey): string => {
	return localStorage.getItem(key);
};

export const setLocalStorageItem = (
	key: LocalStorageKey,
	value: string
): void => {
	localStorage.setItem(key, value);
};

export const removeLocalStorageItem = (key: LocalStorageKey): void => {
	localStorage.removeItem(key);
};

export const setAccessTokenExpiryInLocalStorage = (expiresIn: number) => {
	const validUntil = new Date().getTime() + expiresIn * 1000;
	setLocalStorageItem('auth.valid_until', validUntil.toString());
};

export const setRefreshTokenExpiryInLocalStorage = (
	refreshExpiresIn: number
) => {
	const refreshValidUntil = new Date().getTime() + refreshExpiresIn * 1000;
	setLocalStorageItem(
		'auth.refresh_valid_until',
		refreshValidUntil.toString()
	);
};

export const getTokenExpiryFromLocalStorage = () => ({
	validUntil: parseInt(getLocalStorageItem('auth.valid_until')),
	refreshValidUntil: parseInt(getLocalStorageItem('auth.refresh_valid_until'))
});

export const removeTokenExpiryFromLocalStorage = () => {
	removeLocalStorageItem('auth.valid_until');
	removeLocalStorageItem('auth.refresh_valid_until');
};

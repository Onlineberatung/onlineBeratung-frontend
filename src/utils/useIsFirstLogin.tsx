import { useEffect, useState } from 'react';

export const STORAGE_KEY_LOGIN = 'firstLogin';

export default function useIsFirstLogin() {
	const [isFirstLogin, setIsFirstLogin] = useState(true);

	useEffect(() => {
		try {
			setIsFirstLogin(
				sessionStorage.getItem(STORAGE_KEY_LOGIN) !== 'true'
			);
			sessionStorage.setItem(STORAGE_KEY_LOGIN, 'true');
		} catch {
			// Do nothing
		}
	}, []);

	return isFirstLogin;
}

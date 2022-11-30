import { useEffect, useState } from 'react';

export const STORAGE_KEY_LOGIN = 'firstLogin';

/*
ToDo: This will not work correctly.
 Example #1: If two users use the same device.
 Example #2: If user has the browser always open and come back the next day and login again

 This needs another solution. Reset on logout will not work because logout ist not required every time
 Maybe it needs some solution with onLogin or afterLogin hook or something else
 */
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

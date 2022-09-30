import { useEffect, useState } from 'react';

export const STORAGE_KEY = 'visited';

export default function useIsFirstVisit() {
	const [isFirstVisit, setIsFirstVisit] = useState(true);

	useEffect(() => {
		setIsFirstVisit(sessionStorage.getItem(STORAGE_KEY) !== 'true');
		sessionStorage.setItem(STORAGE_KEY, 'true');
	}, []);

	return isFirstVisit;
}

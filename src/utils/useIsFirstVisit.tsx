import { useEffect, useState } from 'react';

export const STORAGE_KEY_VISITED = 'visited';

export default function useIsFirstVisit() {
	const [isFirstVisit, setIsFirstVisit] = useState(true);

	useEffect(() => {
		try {
			setIsFirstVisit(
				sessionStorage.getItem(STORAGE_KEY_VISITED) !== 'true'
			);
			sessionStorage.setItem(STORAGE_KEY_VISITED, 'true');
		} catch {
			// Do nothing
		}
	}, []);

	return isFirstVisit;
}

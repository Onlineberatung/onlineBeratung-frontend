import { useEffect, useState } from 'react';

export default function useIsFirstVisit() {
	const [isFirstVisit, setIsFirstVisit] = useState(true);

	useEffect(() => {
		try {
			setIsFirstVisit(sessionStorage.getItem('visited') !== 'true');
			sessionStorage.setItem('visited', 'true');
		} catch {
			// Do nothing
		}
	}, []);

	return isFirstVisit;
}

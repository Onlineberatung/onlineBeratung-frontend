import { useEffect, useState } from 'react';

export default function useIsFirstVisit() {
	const [isFirstVisit, setIsFirstVisit] = useState(true);

	useEffect(() => {
		setIsFirstVisit(sessionStorage.getItem('visited') !== 'true');
		sessionStorage.setItem('visited', 'true');
	}, []);

	return isFirstVisit;
}

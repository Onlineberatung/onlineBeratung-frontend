import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export const useSearchParam = <T extends any>(paramKey: string): T => {
	const location = useLocation();

	const [param, setParam] = useState(
		new URLSearchParams(useLocation().search).get(paramKey)
	);

	useEffect(() => {
		const param = new URLSearchParams(location.search).get(paramKey);
		setParam((state) => (state === param ? state : param));
	}, [location.search, paramKey]);

	return param as T;
};

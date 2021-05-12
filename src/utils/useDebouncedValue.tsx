import { useState, useEffect } from 'react';

export default function useDebouncedValue(value, delay) {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(handler);
		};
	}, [value]); // eslint-disable-line react-hooks/exhaustive-deps

	return debouncedValue;
}

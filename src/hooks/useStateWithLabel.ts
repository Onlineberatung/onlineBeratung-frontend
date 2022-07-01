import { useState, useDebugValue } from 'react';

/**
 * helps with debugging state changes in a component by giving the state a label
 * @param initialValue state value
 * @param label state label
 * @returns [getter, setter] state
 */
export const useStateWithLabel = (initialValue, label) => {
	const [value, setValue] = useState(initialValue);
	useDebugValue(`${label}: ${JSON.stringify(value)}`);
	return [value, setValue];
};

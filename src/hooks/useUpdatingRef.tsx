import { MutableRefObject, useEffect, useRef } from 'react';

const useUpdatingRef = (value): MutableRefObject<any> => {
	const ref = useRef(value);

	useEffect(() => {
		ref.current = value;
	}, [value]);

	return ref;
};

export default useUpdatingRef;

import { useCallback, useEffect, useRef } from 'react';

const useDebounceCallback = (func, wait: number, collect: boolean = true) => {
	const timeout = useRef(null);
	const callbackParams: any = useRef(collect ? [] : null);

	useEffect(() => {
		return () => {
			if (timeout.current) {
				callbackParams.current = collect ? [] : null;
				clearTimeout(timeout.current);
			}
		};
	}, [collect]);

	return useCallback(
		(...args) => {
			if (timeout.current) {
				clearTimeout(timeout.current);
			}
			if (collect) {
				callbackParams.current.push(args);
			} else {
				callbackParams.current = args;
			}

			timeout.current = setTimeout(() => {
				func(callbackParams.current);
				callbackParams.current = collect ? [] : null;
			}, wait);
		},
		[collect, func, wait]
	);
};

export default useDebounceCallback;

import { useEffect, useRef } from 'react';

export const useUnload = (fn: Function, unmount: boolean = true) => {
	const callback = useRef(fn);

	useEffect(() => {
		callback.current = fn;
	}, [fn]);

	useEffect(() => {
		const onUnload = () => callback.current();
		window.addEventListener('beforeunload', onUnload);
		return () => {
			if (unmount) {
				onUnload();
			}
			window.removeEventListener('beforeunload', onUnload);
		};
	}, [unmount]);
};

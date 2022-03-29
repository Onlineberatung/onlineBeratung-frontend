import { useCallback, useEffect, useRef, useState } from 'react';

const DEFAULT_INTERVALL = 2000;

export const useWatcher = (
	fn: () => Promise<any>,
	intervall?: number
): [Function, Function, boolean] => {
	const timerId = useRef(null);
	const callback = useRef<() => Promise<any>>(fn);

	useEffect(() => {
		callback.current = fn;
	}, [fn]);

	const [isRunning, setIsRunning] = useState(false);

	const watcher = useCallback(() => {
		callback.current().finally(() => {
			timerId.current = setTimeout(
				watcher,
				intervall || DEFAULT_INTERVALL
			);
		});
	}, [intervall]);

	const startWatcher = useCallback(() => {
		if (timerId.current) {
			return;
		}
		watcher();
		setIsRunning(true);
	}, [watcher]);

	const stopWatcher = useCallback(() => {
		if (!timerId.current) {
			return;
		}
		clearTimeout(timerId.current);
		timerId.current = null;
		setIsRunning(false);
	}, []);

	return [startWatcher, stopWatcher, isRunning];
};

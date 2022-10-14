import { useCallback, useEffect, useRef, useState } from 'react';

const DEFAULT_INTERVALL = 2000;

export const useWatcher = (
	fn: () => Promise<any>,
	intervall?: number
): [Function, Function, boolean] => {
	const timerId = useRef(null);
	const cancelled = useRef(false);
	const callback = useRef<() => Promise<any>>(fn);

	useEffect(() => {
		callback.current = fn;
	}, [fn]);

	const [isRunning, setIsRunning] = useState(false);

	const watcher = useCallback(() => {
		if (timerId.current) {
			clearTimeout(timerId.current);
			timerId.current = null;
		}
		const promise = callback.current();
		if (!promise) {
			timerId.current = setTimeout(
				watcher,
				intervall || DEFAULT_INTERVALL
			);
			return;
		}
		promise.finally(() => {
			// On slow requests could still be in progress when timer is already canceled
			if (cancelled.current) {
				return;
			}
			timerId.current = setTimeout(
				watcher,
				intervall || DEFAULT_INTERVALL
			);
		});
	}, [intervall]);

	const startWatcher = useCallback(() => {
		cancelled.current = false;
		if (timerId.current) {
			return;
		}
		watcher();
		setIsRunning(true);
	}, [watcher]);

	const stopWatcher = useCallback(() => {
		cancelled.current = true;
		if (!timerId.current) {
			return;
		}
		clearTimeout(timerId.current);
		timerId.current = null;
		setIsRunning(false);
	}, []);

	return [startWatcher, stopWatcher, isRunning];
};

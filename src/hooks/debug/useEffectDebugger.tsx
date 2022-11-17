import { useEffect, useRef } from 'react';

const usePrevious = (value, initialValue) => {
	const ref = useRef(initialValue);
	useEffect(() => {
		ref.current = value;
	});
	return ref.current;
};

export const useEffectDebugger = (
	effectHook,
	dependencies,
	dependencyNames
) => {
	const previousDeps = usePrevious(dependencies, []);

	const checkDeps = (newValue, oldValue) => {
		if (newValue === null || oldValue === null) {
			if (newValue !== oldValue) {
				return `${oldValue} -> ${newValue}`;
			}
			return 'NO_CHANGES_FOUND';
		}

		if (typeof newValue === 'object' || typeof oldValue === 'object') {
			if (!newValue || !oldValue) {
				return `${typeof newValue} -> ${typeof oldValue}`;
			}

			const cDeps = {};
			Object.keys(newValue).forEach((key) => {
				const deps = checkDeps(newValue[key], oldValue[key]);
				if (deps !== 'NO_CHANGES_FOUND') {
					cDeps[key] = deps;
				}
			});

			if (Object.keys(cDeps).length <= 0) {
				return 'NO_CHANGES_FOUND';
			}

			return cDeps;
		}

		if (newValue === oldValue) {
			return 'NO_CHANGES_FOUND';
		}

		return `${oldValue} -> ${newValue}`;
	};

	const changedDeps = {};
	(dependencyNames || Object.keys(dependencies)).forEach((key, index) => {
		const deps = checkDeps(dependencies[index], previousDeps[index]);
		if (deps !== 'NO_CHANGES_FOUND') {
			changedDeps[key] = deps;
		}
	});

	if (Object.keys(changedDeps).length) {
		console.log('[use-effect-debugger] ', changedDeps);
	}

	useEffect(effectHook, dependencies); // eslint-disable-line react-hooks/exhaustive-deps
};

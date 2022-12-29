import {
	DependencyList,
	useCallback,
	useEffect,
	useRef,
	useState
} from 'react';
import flatten from 'flat';

export function usePropsMemo<T>(
	selector: (prev: T | null) => T,
	deps: DependencyList,
	props: string[]
): T {
	const prevProps = useRef<{ [key: string]: any }>({});

	const [state, setState] = useState<T>();

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const fn = useCallback(selector, deps);

	useEffect(() => {
		setState((prev) => {
			const res = fn(prev);

			if (!res) {
				setState(null);
				return prev;
			}

			const obj = flatten(res);
			const changedProps = props.reduce((acc, curr) => {
				if (prevProps.current[curr] !== obj[curr]) {
					acc[curr] = obj[curr];
				}
				return acc;
			}, {});

			// Props have not changed
			if (Object.keys(changedProps).length <= 0) {
				return prev;
			}

			prevProps.current = {
				...prevProps,
				...changedProps
			};
			return res;
		});
	}, [props, fn]);

	return state;
}

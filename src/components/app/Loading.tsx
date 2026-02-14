import clsx from 'clsx';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { LoadingIndicator } from '../loadingIndicator/LoadingIndicator';
import './loading.styles.scss';

export const Loading = () => {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		// Delay showing the loading indicator, but hide it again if loading takes too long
		const timeoutIds = [
			setTimeout(() => setIsVisible(true), 500),
			setTimeout(() => setIsVisible(false), 2000)
		];
		return () => timeoutIds.forEach(clearTimeout);
	}, []);

	return (
		<div className={clsx('loading', isVisible && 'loading--visible')}>
			<LoadingIndicator />
		</div>
	);
};

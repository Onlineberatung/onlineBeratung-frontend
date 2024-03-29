import * as React from 'react';
import './LoadingIndicator.styles.scss';

export const LoadingIndicator = () => {
	return (
		<div className="loadingIndicator">
			<div className="loadingIndicator__bounce1" />
			<div className="loadingIndicator__bounce2" />
		</div>
	);
};

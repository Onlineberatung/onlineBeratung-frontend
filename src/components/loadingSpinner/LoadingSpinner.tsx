import React from 'react';
import './LoadingSpinner.styles';

interface LoadingSpinnerProps {}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = () => {
	return (
		<div className="loadingSpinner">
			<div></div>
			<div></div>
			<div></div>
			<div></div>
		</div>
	);
};

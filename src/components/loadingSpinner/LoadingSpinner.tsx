import React from 'react';
import './LoadingSpinner.styles.scss';
import { useTranslation } from 'react-i18next';

interface LoadingSpinnerProps {}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = () => {
	const { t: translate } = useTranslation();
	return (
		<div className="loadingSpinner" title={translate('app.wait')}>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
		</div>
	);
};

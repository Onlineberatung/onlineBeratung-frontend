import * as React from 'react';
import { useTranslation } from 'react-i18next';
import './logo.styles.scss';

const Logo = () => {
	const { t: translate } = useTranslation();
	return (
		<div className="logo">
			<div className="logo__header">{translate('app.title')}</div>
			<div className="logo__subline">{translate('app.claim')}</div>
		</div>
	);
};

export default Logo;

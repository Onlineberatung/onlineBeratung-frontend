import * as React from 'react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { mobileListView } from '../app/navigationHandler';
import { Text } from '../text/Text';
import './session.styles';

export const SessionViewEmpty = () => {
	const { t: translate } = useTranslation();
	useEffect(() => {
		mobileListView();
	}, []);
	return (
		<div className="session session--empty">
			<Text text={translate('session.empty')} type="divider" />
		</div>
	);
};

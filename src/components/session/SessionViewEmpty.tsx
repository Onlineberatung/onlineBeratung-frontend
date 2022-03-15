import * as React from 'react';
import { useEffect } from 'react';
import { translate } from '../../utils/translate';
import { mobileListView } from '../app/navigationHandler';
import { Text } from '../text/Text';
import './session.styles';

export const SessionViewEmpty = () => {
	useEffect(() => {
		mobileListView();
	}, []);
	return (
		<div className="session session--empty">
			<Text text={translate('session.empty')} type="divider" />
		</div>
	);
};

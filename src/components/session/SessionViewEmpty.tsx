import * as React from 'react';
import { translate } from '../../resources/scripts/i18n/translate';
import { Text } from '../text/Text';
import './session.styles';

export const SessionViewEmpty = () => {
	return (
		<div className="session session--empty">
			<Text text={translate('session.empty')} type="divider" />
		</div>
	);
};

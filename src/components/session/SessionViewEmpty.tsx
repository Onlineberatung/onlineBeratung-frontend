import * as React from 'react';
import { translate } from '../../utils/translate';
import { Text } from '../text/Text';
import './session.styles';

export const SessionViewEmpty = () => {
	return (
		<div className="session session--empty">
			<Text text={translate('session.empty')} type="divider" />
		</div>
	);
};

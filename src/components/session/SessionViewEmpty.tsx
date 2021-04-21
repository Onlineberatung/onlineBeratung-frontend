import * as React from 'react';
import { translate } from '../../resources/scripts/i18n/translate';
import './session.styles';

export const SessionViewEmpty = () => {
	return (
		<div className="session session--empty">
			<p>{translate('session.empty')}</p>
		</div>
	);
};

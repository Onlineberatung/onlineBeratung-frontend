import * as React from 'react';
import { translate } from '../../utils/translate';
import './session.styles';

export const SessionViewEmpty = () => {
	return (
		<div className="session session--empty">
			<p>{translate('session.empty')}</p>
		</div>
	);
};

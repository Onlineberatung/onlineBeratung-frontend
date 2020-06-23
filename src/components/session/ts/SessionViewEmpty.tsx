import * as React from 'react';
import { translate } from '../../../resources/ts/i18n/translate';

export const SessionViewEmpty = () => {
	return (
		<div className="session session--empty">
			<p>{translate('session.empty')}</p>
		</div>
	);
};

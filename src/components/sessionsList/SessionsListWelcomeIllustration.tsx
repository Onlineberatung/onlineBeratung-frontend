import * as React from 'react';
import { translate } from '../../resources/scripts/i18n/translate';
import { ReactComponent as WelcomeIcon } from '../../resources/img/illustrations/willkommen.svg';

export const WelcomeIllustration = () => {
	return (
		<div className="sessionsList__illustration__wrapper">
			<div className="sessionsList__illustration__image">
				<WelcomeIcon />
			</div>
			<p className="sessionsList__illustration__infotext">
				{translate('sessionList.asker.welcome')}
			</p>
		</div>
	);
};

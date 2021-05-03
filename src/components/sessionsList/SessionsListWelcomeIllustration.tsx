import * as React from 'react';
import { translate } from '../../utils/translate';
import { ReactComponent as WelcomeIcon } from '../../resources/img/illustrations/willkommen.svg';

export const WelcomeIllustration = () => {
	return (
		<div
			className="sessionsList__illustration__wrapper"
			data-cy="session-list-welcome-illustration"
		>
			<div className="sessionsList__illustration__image">
				<WelcomeIcon />
			</div>
			<p className="sessionsList__illustration__infotext">
				{translate('sessionList.asker.welcome')}
			</p>
		</div>
	);
};

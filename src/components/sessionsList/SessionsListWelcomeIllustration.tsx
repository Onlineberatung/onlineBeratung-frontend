import * as React from 'react';
import { translate } from '../../resources/scripts/i18n/translate';

export const WelcomeIllustration = () => {
	return (
		<div className="sessionsList__illustration__wrapper">
			<div className="sessionsList__illustration__image">
				<img
					src="/resources/img/illustrations/willkommen.svg"
					alt="Willkommen Illustration"
				/>
			</div>
			<p className="sessionsList__illustration__infotext">
				{translate('sessionList.asker.welcome')}
			</p>
		</div>
	);
};

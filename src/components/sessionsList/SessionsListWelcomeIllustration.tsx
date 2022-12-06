import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { ReactComponent as WelcomeIcon } from '../../resources/img/illustrations/welcome.svg';

export const WelcomeIllustration = () => {
	const { t: translate } = useTranslation();
	return (
		<div
			className="sessionsList__illustration__wrapper"
			data-cy="session-list-welcome-illustration"
		>
			<div className="sessionsList__illustration__image">
				<WelcomeIcon aria-hidden="true" />
			</div>
			<p className="sessionsList__illustration__infotext">
				{translate('sessionList.asker.welcome')}
			</p>
		</div>
	);
};

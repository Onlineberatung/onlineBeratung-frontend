import * as React from 'react';
import { translate } from '../../../resources/ts/i18n/translate';

export const SessionsListUnreadIllustration = () => {
	return (
		<div className="sessionsList__illustration__wrapper">
			<div className="sessionsList__illustration__image">
				<img src="/resources/img/illustrations/envelope-new.svg" />
			</div>
			<p className="sessionsList__illustration__infotext">
				{translate('sessionList.asker.unread.firstLine')}
				<br />
				{translate('sessionList.asker.unread.secondLine')}
			</p>
		</div>
	);
};

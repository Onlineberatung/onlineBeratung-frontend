import * as React from 'react';
import { translate } from '../../../resources/ts/i18n/translate';

declare var RESOURCE_URL: string;

export const SessionListCreateChat = () => {
	return (
		<div className="sessionsListItem sessionsListItem--active createChatItem">
			<div className="sessionsListItem__content sessionsListItem__content--active">
				<div className="sessionsListItem__row">
					<div className="sessionsListItem__consultingType"></div>
				</div>
				<div className="sessionsListItem__row">
					<img
						className="sessionsListItem__icon"
						src={
							RESOURCE_URL +
							'resources/img/icons/speech-bubble.svg'
						}
					/>
					<div className="sessionsListItem__username">
						{translate('groupChat.create.listItem.label')}
					</div>
				</div>
				<div className="sessionsListItem__row">
					<div className="sessionsListItem__subject"></div>
					<div className="sessionsListItem__date"></div>
				</div>
			</div>
		</div>
	);
};

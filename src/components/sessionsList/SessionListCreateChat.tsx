import * as React from 'react';
import { useTranslation } from 'react-i18next';
import SpeechBubblePlusIcon from '../../resources/img/icons/speech-bubble-plus.svg?react';
import './sessionsList.styles.scss';

export const SessionListCreateChat = () => {
	const { t: translate } = useTranslation();

	return (
		<div className="sessionsListItem sessionsListItem--active createChatItem">
			<div
				className="sessionsListItem__content sessionsListItem__content--active"
				tabIndex={2}
			>
				<div className="sessionsListItem__row">
					<div className="sessionsListItem__consultingType"></div>
				</div>
				<div className="sessionsListItem__row">
					<SpeechBubblePlusIcon className="sessionsListItem__icon" />
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

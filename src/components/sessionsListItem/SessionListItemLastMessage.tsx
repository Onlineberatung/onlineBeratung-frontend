import React from 'react';
import { ALIAS_LAST_MESSAGES } from '../../resources/scripts/config';
import { translate } from '../../utils/translate';

interface SessionListItemLastMessageProps {
	showSpan?: boolean;
	showLanguage?: boolean;
	language?: string;
	lastMessage: string | null;
	lastMessageType?: string | null;
}

export const SessionListItemLastMessage: React.FC<SessionListItemLastMessageProps> =
	({ showSpan, language, lastMessage, lastMessageType, showLanguage }) => {
		// do not show anything
		if (showSpan) return <span></span>;

		const languageAddOn = (
			<span>
				{/* we need a &nbsp; here, to ensure correct spacing for long messages */}
				{showLanguage && language && language.toUpperCase()} |&nbsp;
			</span>
		);

		const aliasMessage = ALIAS_LAST_MESSAGES[lastMessageType];

		return (
			<div
				className={`sessionsListItem__subject ${
					aliasMessage
						? 'sessionsListItem__subject--aliasMessage'
						: ''
				}`}
			>
				{showLanguage && language && languageAddOn}
				{aliasMessage ? translate(aliasMessage) : lastMessage}
			</div>
		);
	};

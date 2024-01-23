import React from 'react';
import { useTranslation } from 'react-i18next';
import { ALIAS_LAST_MESSAGES } from '../../resources/scripts/config';

interface SessionListItemLastMessageProps {
	showSpan?: boolean;
	showLanguage?: boolean;
	language?: string;
	lastMessage: string | null;
	lastMessageType?: string | null;
}

export const SessionListItemLastMessage: React.FC<
	SessionListItemLastMessageProps
> = ({ showSpan, language, lastMessage, lastMessageType, showLanguage }) => {
	const { t: translate } = useTranslation();

	// do not show anything
	if (showSpan) return <span></span>;
	if (!lastMessage && !lastMessageType) return null;

	const languageAddOn = (
		<span>
			{/* we need a &nbsp; here, to ensure correct spacing for long messages */}
			{showLanguage && language && language.toUpperCase()} |&nbsp;
		</span>
	);

	let aliasMessage = ALIAS_LAST_MESSAGES[lastMessageType];

	// reassign_consultant alias can have multiple states
	if (lastMessageType === 'REASSIGN_CONSULTANT') {
		try {
			if (JSON.parse(lastMessage)?.status) {
				aliasMessage += `.${JSON.parse(lastMessage).status}`;
			}
		} catch {
			// if no json -> do nothing
		}
	}

	return (
		<div
			className={`sessionsListItem__subject ${
				aliasMessage ? 'sessionsListItem__subject--aliasMessage' : ''
			}`}
		>
			{showLanguage && language && languageAddOn}
			{aliasMessage ? translate(aliasMessage) : lastMessage}
		</div>
	);
};

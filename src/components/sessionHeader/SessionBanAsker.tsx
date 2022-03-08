import React from 'react';
import { apiPostAskerBan } from '../../api/apiPostAskerBan';

interface SessionBanAskerProps {
	rcUserId: string;
	rcToken: string;
	chatId: number;
}

export const SessionBanAsker: React.FC<SessionBanAskerProps> = ({
	rcUserId,
	chatId,
	rcToken
}) => {
	const banUser = () => {
		apiPostAskerBan({ rcUserId, chatId, rcToken });
	};

	return <button onClick={banUser}>Bannen {/* TODO i18n */}</button>;
};

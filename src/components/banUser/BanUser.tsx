import React from 'react';
import { apiPostBanUser } from '../../api/apiPostBanUser';
import './banUser.styles.scss';

interface BanUserProps {
	rcUserId: string;
	rcToken: string;
	chatId: number;
}

export const BanUser: React.FC<BanUserProps> = ({
	rcUserId,
	chatId,
	rcToken
}) => {
	const banUser = () => {
		apiPostBanUser({ rcUserId, chatId, rcToken });
	};

	return (
		<button className="banUser" onClick={banUser}>
			Bannen {/* TODO i18n */}
		</button>
	);
};

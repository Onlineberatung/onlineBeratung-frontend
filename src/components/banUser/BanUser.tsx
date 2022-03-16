import React, { useState } from 'react';
import { apiPostBanUser } from '../../api/apiPostBanUser';
import { translate } from '../../utils/translate';
import { Overlay, OverlayItem, OverlayWrapper } from '../overlay/Overlay';
import './banUser.styles.scss';
import { banSuccessOverlay } from './banUserHelper';

interface BanUserProps {
	rcUserId: string;
	userName: string;
	chatId: number;
	handleUserBan?: (username: string) => void;
}

export const BanUser: React.FC<BanUserProps> = ({
	rcUserId,
	chatId,
	userName,
	handleUserBan
}) => {
	const [overlayActive, setOverlayActive] = useState(false);
	const [overlayItem, setOverlayItem] = useState<OverlayItem>();

	const banUser = () => {
		apiPostBanUser({ rcUserId, chatId }).then(() => {
			setOverlayItem(banSuccessOverlay(userName));
			setOverlayActive(true);
			if (handleUserBan) handleUserBan(userName);
		});
	};

	return (
		<>
			<button className="banUser" onClick={banUser}>
				{translate('banUser.ban.trigger')}
			</button>
			{overlayActive && (
				<OverlayWrapper>
					<Overlay
						className="banUser__overlay"
						item={overlayItem}
						handleOverlayClose={() => setOverlayActive(false)}
						handleOverlay={() => setOverlayActive(false)}
					/>
				</OverlayWrapper>
			)}
		</>
	);
};

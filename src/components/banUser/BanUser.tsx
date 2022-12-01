import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiPostBanUser } from '../../api/apiPostBanUser';
import { BUTTON_TYPES } from '../button/Button';
import { Headline } from '../headline/Headline';
import { Overlay, OverlayItem } from '../overlay/Overlay';
import { ReactComponent as Check } from '../../resources/img/illustrations/check.svg';
import './banUser.styles.scss';

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
	const { t: translate } = useTranslation();
	const [overlayActive, setOverlayActive] = useState(false);
	const [overlayItem, setOverlayItem] = useState<OverlayItem>();

	const banSuccessOverlay = (userName): OverlayItem => {
		const compositeText =
			translate('banUser.ban.info.1') +
			'<span>' +
			userName +
			'</span>' +
			translate('banUser.ban.info.2');
		return {
			svg: Check,
			illustrationBackground: 'large',
			nestedComponent: (
				<Headline text={compositeText} semanticLevel="3" />
			),
			buttonSet: [
				{
					type: BUTTON_TYPES.AUTO_CLOSE,
					label: translate('banUser.ban.overlay.close')
				}
			]
		};
	};

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
				<Overlay
					className="banUser__overlay"
					item={overlayItem}
					handleOverlayClose={() => setOverlayActive(false)}
					handleOverlay={() => setOverlayActive(false)}
				/>
			)}
		</>
	);
};

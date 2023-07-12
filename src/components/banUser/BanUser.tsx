import React from 'react';
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

interface BanUserOverlayProps {
	overlayActive: boolean;
	userName: string;
	handleOverlay?: () => void;
}

export const BanUser: React.VFC<BanUserProps> = ({
	rcUserId,
	chatId,
	userName,
	handleUserBan
}) => {
	const { t: translate } = useTranslation();

	const banUser = () => {
		apiPostBanUser({ rcUserId, chatId }).then(() => {
			if (handleUserBan) handleUserBan(userName);
		});
	};

	return (
		<button className="banUser" onClick={banUser}>
			{translate('banUser.ban.trigger')}
		</button>
	);
};

export const BanUserOverlay: React.VFC<BanUserOverlayProps> = ({
	overlayActive,
	userName,
	handleOverlay
}) => {
	const { t: translate } = useTranslation();

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
					type: BUTTON_TYPES.PRIMARY,
					label: translate('banUser.ban.overlay.close')
				}
			]
		};
	};

	return (
		<>
			{overlayActive && (
				<Overlay
					className="banUser__overlay"
					item={banSuccessOverlay(userName)}
					handleOverlayClose={handleOverlay}
					handleOverlay={handleOverlay}
				/>
			)}
		</>
	);
};

import React, { useState } from 'react';
import './e2eeActivatedMessage.styles';
import { Overlay, OverlayWrapper } from '../overlay/Overlay';
import { subscriptionKeyLostOverlayItem } from '../session/subscriptionKeyLostHelper';
import { Button, BUTTON_TYPES } from '../button/Button';
import { useTranslation } from 'react-i18next';

interface MasterKeyLostMessageProps {
	subscriptionKeyLost: boolean;
}

export const MasterKeyLostMessage: React.FC<MasterKeyLostMessageProps> = ({
	subscriptionKeyLost
}) => {
	const { t: translate } = useTranslation();
	const [overlayActive, setOverlayActive] = useState(false);

	return (
		<>
			{translate(
				`e2ee.subscriptionKeyLost.message.${
					subscriptionKeyLost ? 'primary' : 'secondary'
				}`
			)}{' '}
			{!subscriptionKeyLost && (
				<Button
					buttonHandle={() => setOverlayActive(true)}
					item={{
						type: BUTTON_TYPES.LINK_INLINE,
						label: 'Mehr erfahren'
					}}
					isLink={true}
				/>
			)}
			{overlayActive && (
				<OverlayWrapper>
					<Overlay
						item={subscriptionKeyLostOverlayItem}
						handleOverlay={() => setOverlayActive(false)}
						handleOverlayClose={() => setOverlayActive(false)}
					/>
				</OverlayWrapper>
			)}
		</>
	);
};

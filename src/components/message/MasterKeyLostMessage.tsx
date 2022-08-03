import React, { useState } from 'react';
import { translate } from '../../utils/translate';

import './e2eeActivatedMessage.styles';
import { Overlay, OverlayWrapper } from '../overlay/Overlay';
import { subscriptionKeyLostOverlayItem } from '../session/subscriptionKeyLostHelper';
import { Button, BUTTON_TYPES } from '../button/Button';
import { ICON_INFO, SystemMessage } from './SystemMessage';

interface MasterKeyLostMessageProps {
	subscriptionKeyLost: boolean;
}

export const MasterKeyLostMessage: React.FC<MasterKeyLostMessageProps> = ({
	subscriptionKeyLost
}) => {
	const [overlayActive, setOverlayActive] = useState(false);

	return (
		<SystemMessage
			icon={ICON_INFO}
			subject={
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
				</>
			}
		>
			{overlayActive && (
				<OverlayWrapper>
					<Overlay
						item={subscriptionKeyLostOverlayItem}
						handleOverlay={() => setOverlayActive(false)}
						handleOverlayClose={() => setOverlayActive(false)}
					/>
				</OverlayWrapper>
			)}
		</SystemMessage>
	);
};

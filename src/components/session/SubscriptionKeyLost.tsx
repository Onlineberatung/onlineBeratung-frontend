import * as React from 'react';
import { useCallback, useContext, useState } from 'react';
import { Button, BUTTON_TYPES } from '../button/Button';
import { ActiveSessionContext } from '../../globalState';
import {
	ALIAS_MESSAGE_TYPES,
	apiSendAliasMessage
} from '../../api/apiSendAliasMessage';
import { MessageSubmitInfo } from '../messageSubmitInterface/MessageSubmitInfo';
import { Overlay } from '../overlay/Overlay';
import { subscriptionKeyLostOverlayItem } from './subscriptionKeyLostHelper';
import { useTranslation } from 'react-i18next';

export const SubscriptionKeyLost = () => {
	const { t: translate } = useTranslation();
	const [overlayActive, setOverlayActive] = useState(false);
	const { activeSession, reloadActiveSession } =
		useContext(ActiveSessionContext);

	const handleButton = useCallback(() => {
		apiSendAliasMessage({
			rcGroupId: activeSession.rid,
			type: ALIAS_MESSAGE_TYPES.MASTER_KEY_LOST
		})
			.then(reloadActiveSession)
			.catch((e) => console.error(e));
	}, [activeSession.rid, reloadActiveSession]);

	return (
		<div>
			<MessageSubmitInfo
				isInfo={true}
				infoMessage={
					<div>
						<p>
							{translate('e2ee.subscriptionKeyLost.notice.title')}
							<br />
							{translate(
								'e2ee.subscriptionKeyLost.notice.text'
							)}{' '}
							<Button
								buttonHandle={() => setOverlayActive(true)}
								item={{
									type: BUTTON_TYPES.LINK_INLINE,
									label: translate(
										'e2ee.subscriptionKeyLost.notice.more'
									)
								}}
								isLink={true}
							/>
						</p>
						{activeSession?.item?.lastMessageType !==
							ALIAS_MESSAGE_TYPES.MASTER_KEY_LOST && (
							<div>
								<Button
									buttonHandle={handleButton}
									item={{
										type: BUTTON_TYPES.PRIMARY,
										label: translate(
											'e2ee.subscriptionKeyLost.notice.link'
										)
									}}
								/>
							</div>
						)}
					</div>
				}
			/>
			{overlayActive && (
				<Overlay
					item={subscriptionKeyLostOverlayItem}
					handleOverlay={() => setOverlayActive(false)}
					handleOverlayClose={() => setOverlayActive(false)}
				/>
			)}
		</div>
	);
};

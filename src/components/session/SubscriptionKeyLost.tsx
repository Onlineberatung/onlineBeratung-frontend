import * as React from 'react';
import { useCallback, useContext, useState } from 'react';
import { Button, BUTTON_TYPES } from '../button/Button';
import { ActiveSessionContext } from '../../globalState/provider/ActiveSessionProvider';
import {
	ALIAS_MESSAGE_TYPES,
	apiSendAliasMessage
} from '../../api/apiSendAliasMessage';
import { MessageSubmitInfo } from '../messageSubmitInterface/MessageSubmitInfo';
import { Overlay, OverlayWrapper } from '../overlay/Overlay';
import { subscriptionKeyLostOverlayItem } from './subscriptionKeyLostHelper';
import { translate } from '../../utils/translate';

export const SubscriptionKeyLost = () => {
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

	/*
	{
		isInfo: true,
			infoHeadline: `${
		getContact(activeSession).displayName ||
		getContact(activeSession).username
	} ${translate('consultant.absent.message')} `,
		infoMessage: activeSession.consultant.absenceMessage
	}
	 */

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
									label: 'Mehr erfahren'
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
				<OverlayWrapper>
					<Overlay
						item={subscriptionKeyLostOverlayItem}
						handleOverlay={() => setOverlayActive(false)}
						handleOverlayClose={() => setOverlayActive(false)}
					/>
				</OverlayWrapper>
			)}
		</div>
	);
};

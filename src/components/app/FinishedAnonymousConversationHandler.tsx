import {
	OverlayItem,
	OVERLAY_FUNCTIONS,
	OverlayWrapper,
	Overlay
} from '../overlay/Overlay';
import { BUTTON_TYPES } from '../button/Button';
import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import {
	AnonymousConversationFinishedContext,
	RocketChatContext
} from '../../globalState';
import { translate } from '../../utils/translate';
import { ReactComponent as WavingIllustration } from '../../resources/img/illustrations/waving.svg';
import { removeAllCookies } from '../sessionCookie/accessSessionCookie';
import { useAppConfig } from '../../hooks/useAppConfig';

export const FinishedAnonymousConversationHandler = () => {
	const settings = useAppConfig();
	const [overlayActive, setOverlayActive] = useState(false);
	const { anonymousConversationFinished, setAnonymousConversationFinished } =
		useContext(AnonymousConversationFinishedContext);
	const { close: closeWebsocket } = useContext(RocketChatContext);

	useEffect(() => {
		if (anonymousConversationFinished === 'IN_PROGRESS') {
			closeWebsocket();
			setOverlayActive(true);
			removeAllCookies();
			setAnonymousConversationFinished(null);
		}
	}, [
		anonymousConversationFinished,
		closeWebsocket,
		setAnonymousConversationFinished
	]);

	const overlayItem: OverlayItem = {
		svg: WavingIllustration,
		illustrationBackground: 'neutral',
		headline: translate('anonymous.overlay.chatWasFinished.headline'),
		headlineStyleLevel: '1',
		copy: translate('anonymous.overlay.chatWasFinished.copy'),
		buttonSet: [
			{
				label: translate('anonymous.overlay.chatWasFinished.button'),
				function: OVERLAY_FUNCTIONS.REDIRECT_TO_URL,
				type: BUTTON_TYPES.PRIMARY
			}
		]
	};

	const handleOverlayAction = (buttonFunction: string) => {
		if (buttonFunction === OVERLAY_FUNCTIONS.REDIRECT_TO_URL) {
			window.location.href = settings.urls.finishedAnonymousChatRedirect;
		}
	};

	if (!overlayActive) return null;

	return (
		<>
			<OverlayWrapper>
				<Overlay
					item={overlayItem}
					handleOverlay={handleOverlayAction}
				/>
			</OverlayWrapper>
		</>
	);
};

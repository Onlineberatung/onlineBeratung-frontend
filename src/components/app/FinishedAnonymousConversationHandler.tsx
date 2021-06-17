import {
	OverlayItem,
	OVERLAY_FUNCTIONS,
	OverlayWrapper,
	Overlay
} from '../overlay/Overlay';
import { BUTTON_TYPES } from '../button/Button';
import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { AnonymousConversationFinishedContext } from '../../globalState';
import { translate } from '../../utils/translate';
import { ReactComponent as WavingIllustration } from '../../resources/img/illustrations/waving.svg';
import { removeAllCookies } from '../sessionCookie/accessSessionCookie';
import { config } from '../../resources/scripts/config';

export const FinishedAnonymousConversationHandler = () => {
	const [overlayActive, setOverlayActive] = useState(false);
	const {
		anonymousConversationFinished,
		setAnonymousConversationFinished
	} = useContext(AnonymousConversationFinishedContext);

	useEffect(() => {
		if (anonymousConversationFinished === 'IN_PROGRESS') {
			setOverlayActive(true);
			removeAllCookies();
			setAnonymousConversationFinished(null);
		}
	}, [anonymousConversationFinished, setAnonymousConversationFinished]);

	const overlayItem: OverlayItem = {
		svg: WavingIllustration,
		illustrationBackground: 'grey',
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
			window.location.href = config.urls.finishedAnonymousChatRedirect;
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

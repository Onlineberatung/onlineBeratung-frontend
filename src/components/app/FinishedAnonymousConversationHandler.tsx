import { OVERLAY_FUNCTIONS, Overlay } from '../overlay/Overlay';
import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import {
	AnonymousConversationFinishedContext,
	RocketChatContext
} from '../../globalState';
import { removeAllCookies } from '../sessionCookie/accessSessionCookie';
import { useAppConfig } from '../../hooks/useAppConfig';
import {
	finishAnonymousChatSuccessOverlayItem,
	selfFinishedAnonymousChatSuccessOverlayItem
} from '../sessionMenu/sessionMenuHelpers';

export const FinishedAnonymousConversationHandler = () => {
	const settings = useAppConfig();

	const [overlayActive, setOverlayActive] = useState(false);
	const { anonymousConversationFinished, setAnonymousConversationFinished } =
		useContext(AnonymousConversationFinishedContext);
	const { close: closeWebsocket } = useContext(RocketChatContext);

	/*
	 ToDo: Refactor the anonymous logic because dropping cookies is not a clear logout.
	 Other requests should be blocked too because refresh requests will end in 401
	 */
	useEffect(() => {
		if (anonymousConversationFinished) {
			closeWebsocket(false);
			setOverlayActive(true);
			setTimeout(() => {
				removeAllCookies();
			}, 1500);
		} else {
			setOverlayActive(false);
		}
	}, [
		anonymousConversationFinished,
		closeWebsocket,
		setAnonymousConversationFinished
	]);

	const handleOverlayAction = (buttonFunction: string) => {
		if (buttonFunction === OVERLAY_FUNCTIONS.REDIRECT_TO_URL) {
			window.location.href = settings.urls.finishedAnonymousChatRedirect;
		}
	};

	if (!overlayActive) return null;

	return (
		<Overlay
			item={
				anonymousConversationFinished === 'DONE'
					? finishAnonymousChatSuccessOverlayItem
					: selfFinishedAnonymousChatSuccessOverlayItem
			}
			handleOverlay={handleOverlayAction}
		/>
	);
};

import { decode } from 'hi-base32';
import { OverlayItem, OVERLAY_FUNCTIONS } from '../../overlay/ts/Overlay';
import { translate } from '../../../resources/ts/i18n/translate';
import { BUTTON_TYPES } from '../../button/ts/Button';

export const decodeSubscriber = (subscriber: string) => {
	const isEncoded =
		subscriber.split('.') && subscriber.split('.')[0] === 'enc';
	return isEncoded
		? decode(subscriber.split('.')[1].toUpperCase() + '=')
		: subscriber;
};

export const updateChatSuccessOverlayItem: OverlayItem = {
	imgSrc: '/../resources/img/illustrations/check.svg',
	headline: translate('groupChat.updateSuccess.overlayHeadline'),
	buttonSet: [
		{
			label: translate('groupChat.updateSuccess.overlay.button1Label'),
			function: OVERLAY_FUNCTIONS.CLOSE,
			type: BUTTON_TYPES.GHOST
		}
	]
};

export const isGroupChatOwner = (activeSession, userData) => {
	if (activeSession.consultant && userData) {
		return activeSession.consultant.id === userData.userId;
	} else {
		return false;
	}
};

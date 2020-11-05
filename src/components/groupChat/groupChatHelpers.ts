import { OverlayItem, OVERLAY_FUNCTIONS } from '../overlay/Overlay';
import { translate } from '../../resources/scripts/i18n/translate';
import { BUTTON_TYPES } from '../button/Button';

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

import { OverlayItem, OVERLAY_FUNCTIONS } from '../overlay/Overlay';
import { translate } from '../../utils/translate';
import { BUTTON_TYPES } from '../button/Button';
import { ReactComponent as CheckIcon } from '../../resources/img/illustrations/check.svg';

export const updateChatSuccessOverlayItem: OverlayItem = {
	svg: CheckIcon,
	headline: translate('groupChat.updateSuccess.overlayHeadline'),
	buttonSet: [
		{
			label: translate('groupChat.updateSuccess.overlay.button1Label'),
			function: OVERLAY_FUNCTIONS.CLOSE,
			type: BUTTON_TYPES.SECONDARY
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

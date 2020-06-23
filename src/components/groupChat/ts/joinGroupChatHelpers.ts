import { BUTTON_TYPES, ButtonItem } from '../../button/ts/Button';
import { translate } from '../../../resources/ts/i18n/translate';
import { OverlayItem, OVERLAY_FUNCTIONS } from '../../overlay/ts/Overlay';

export const joinButtonItem: ButtonItem = {
	label: translate('groupChat.join.button.label.join'),
	type: BUTTON_TYPES.PRIMARY
};

export const startButtonItem: ButtonItem = {
	label: translate('groupChat.join.button.label.start'),
	type: BUTTON_TYPES.PRIMARY
};

export const startJoinGroupChatErrorOverlay: OverlayItem = {
	imgSrc: '/../resources/img/illustrations/x.svg',
	headline: translate('groupChat.joinError.overlay.headline'),
	buttonSet: [
		{
			label: translate('groupChat.joinError.overlay.buttonLabel'),
			function: OVERLAY_FUNCTIONS.CLOSE,
			type: BUTTON_TYPES.PRIMARY
		}
	]
};

export const joinGroupChatClosedErrorOverlay: OverlayItem = {
	imgSrc: '/../resources/img/illustrations/x.svg',
	headline: translate('groupChat.join.chatClosedOverlay.headline'),
	buttonSet: [
		{
			label: translate('groupChat.join.chatClosedOverlay.button1Label'),
			function: OVERLAY_FUNCTIONS.REDIRECT,
			type: BUTTON_TYPES.PRIMARY
		},
		{
			label: translate('groupChat.join.chatClosedOverlay.button2Label'),
			function: OVERLAY_FUNCTIONS.LOGOUT,
			type: BUTTON_TYPES.GHOST
		}
	]
};

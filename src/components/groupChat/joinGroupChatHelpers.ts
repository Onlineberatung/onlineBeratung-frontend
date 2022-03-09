import { BUTTON_TYPES, ButtonItem } from '../button/Button';
import { translate } from '../../utils/translate';
import { OverlayItem, OVERLAY_FUNCTIONS } from '../overlay/Overlay';
import { ReactComponent as XIcon } from '../../resources/img/illustrations/x.svg';

export const joinButtonItem: ButtonItem = {
	label: translate('groupChat.join.button.label.join'),
	type: BUTTON_TYPES.PRIMARY
};

export const startButtonItem: ButtonItem = {
	label: translate('groupChat.join.button.label.start'),
	type: BUTTON_TYPES.PRIMARY
};

export const startJoinGroupChatErrorOverlay: OverlayItem = {
	svg: XIcon,
	illustrationBackground: 'error',
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
	svg: XIcon,
	illustrationBackground: 'error',
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
			type: BUTTON_TYPES.SECONDARY
		}
	]
};

export const bannedUserOverlay: OverlayItem = {
	svg: XIcon,
	illustrationBackground: 'large',
	headline: 'Sie wurden gebannt.', // TODO
	copy: 'Sie haben gegen unsere Spielregeln im Chat verstoßen. Unsere Spielregeln stehen finden Sie immer auf der ersten Seite des Chats. Wenn Sie sich an die Regeln halten, heißt Sie Ihr_e Moderator_in wieder herzlich Willkommen.' // TODO
};

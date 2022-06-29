import { OverlayItem, OVERLAY_FUNCTIONS } from '../overlay/Overlay';
import { translate } from '../../utils/translate';
import { BUTTON_TYPES } from '../button/Button';
import { ReactComponent as CheckIllustration } from '../../resources/img/illustrations/check.svg';
import { ReactComponent as XIllustration } from '../../resources/img/illustrations/x.svg';
import { ReactComponent as WavingIllustration } from '../../resources/img/illustrations/waving.svg';

export const stopGroupChatSecurityOverlayItem: OverlayItem = {
	svg: XIllustration,
	illustrationBackground: 'error',
	headline: translate('groupChat.stopChat.securityOverlay.headline'),
	copy: '',
	buttonSet: [
		{
			label: translate('groupChat.stopChat.securityOverlay.button1Label'),
			function: OVERLAY_FUNCTIONS.STOP_GROUP_CHAT,
			type: BUTTON_TYPES.PRIMARY
		},
		{
			label: translate('groupChat.stopChat.securityOverlay.button2Label'),
			function: OVERLAY_FUNCTIONS.CLOSE,
			type: BUTTON_TYPES.SECONDARY
		}
	]
};

export const stopGroupChatSuccessOverlayItem: OverlayItem = {
	svg: CheckIllustration,
	headline: translate('groupChat.stopChat.successOverlay.headline'),
	buttonSet: [
		{
			label: translate('groupChat.stopChat.successOverlay.button1Label'),
			function: OVERLAY_FUNCTIONS.REDIRECT,
			type: BUTTON_TYPES.PRIMARY
		},
		{
			label: translate('groupChat.stopChat.successOverlay.button2Label'),
			function: OVERLAY_FUNCTIONS.LOGOUT,
			type: BUTTON_TYPES.SECONDARY
		}
	]
};

export const groupChatErrorOverlayItem: OverlayItem = {
	svg: XIllustration,
	illustrationBackground: 'error',
	headline: translate('groupChat.createError.overlay.headline'),
	buttonSet: [
		{
			label: translate('groupChat.createError.overlay.buttonLabel'),
			function: OVERLAY_FUNCTIONS.CLOSE,
			type: BUTTON_TYPES.PRIMARY
		}
	]
};

export const leaveGroupChatSecurityOverlayItem: OverlayItem = {
	svg: XIllustration,
	illustrationBackground: 'error',
	headline: translate('groupChat.leaveChat.securityOverlay.headline'),
	buttonSet: [
		{
			label: translate(
				'groupChat.leaveChat.securityOverlay.button1Label'
			),
			function: OVERLAY_FUNCTIONS.LEAVE_GROUP_CHAT,
			type: BUTTON_TYPES.PRIMARY
		},
		{
			label: translate(
				'groupChat.leaveChat.securityOverlay.button2Label'
			),
			function: OVERLAY_FUNCTIONS.CLOSE,
			type: BUTTON_TYPES.SECONDARY
		}
	]
};

export const leaveGroupChatSuccessOverlayItem: OverlayItem = {
	svg: CheckIllustration,
	headline: translate('groupChat.leaveChat.successOverlay.headline'),
	buttonSet: [
		{
			label: translate('groupChat.leaveChat.successOverlay.button1Label'),
			function: OVERLAY_FUNCTIONS.REDIRECT,
			type: BUTTON_TYPES.PRIMARY
		},
		{
			label: translate('groupChat.leaveChat.successOverlay.button2Label'),
			function: OVERLAY_FUNCTIONS.LOGOUT,
			type: BUTTON_TYPES.SECONDARY
		}
	]
};

export const finishAnonymousChatSecurityOverlayItem: OverlayItem = {
	svg: WavingIllustration,
	illustrationBackground: 'neutral',
	headline: translate('anonymous.overlay.finishChat.headline'),
	copy: translate('anonymous.overlay.finishChat.consultant.copy'),
	buttonSet: [
		{
			label: translate('anonymous.overlay.finishChat.button1'),
			function: OVERLAY_FUNCTIONS.FINISH_ANONYMOUS_CONVERSATION,
			type: BUTTON_TYPES.PRIMARY
		},
		{
			label: translate('anonymous.overlay.finishChat.button2'),
			function: OVERLAY_FUNCTIONS.CLOSE,
			type: BUTTON_TYPES.SECONDARY
		}
	]
};

export const finishAnonymousChatSuccessOverlayItem: OverlayItem = {
	svg: CheckIllustration,
	illustrationBackground: 'info',
	headline: translate('anonymous.overlay.finishChat.success.headline'),
	buttonSet: [
		{
			label: translate('anonymous.overlay.finishChat.success.button'),
			function: OVERLAY_FUNCTIONS.REDIRECT_TO_URL,
			type: BUTTON_TYPES.PRIMARY
		}
	]
};

export const archiveSessionSuccessOverlayItem: OverlayItem = {
	svg: CheckIllustration,
	illustrationBackground: 'info',
	copy: translate('archive.overlay.session.success.copy'),
	buttonSet: [
		{
			label: translate('archive.overlay.session.success.button'),
			function: OVERLAY_FUNCTIONS.ARCHIVE,
			type: BUTTON_TYPES.AUTO_CLOSE
		}
	]
};

export const videoCallErrorOverlayItem: OverlayItem = {
	svg: XIllustration,
	illustrationBackground: 'neutral',
	headline: translate('videoCall.overlay.unsupported.headline'),
	copy: translate(`videoCall.overlay.unsupported.copy`),
	buttonSet: [
		{
			label: translate('videoCall.overlay.unsupported.button.close'),
			function: OVERLAY_FUNCTIONS.CLOSE,
			type: BUTTON_TYPES.SECONDARY
		},
		{
			label: translate('videoCall.overlay.unsupported.button.manual'),
			function: 'GOTO_MANUAL',
			type: BUTTON_TYPES.PRIMARY
		}
	]
};

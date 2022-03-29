import { translate } from '../../utils/translate';
import { BUTTON_TYPES } from '../button/Button';
import { OverlayItem, OVERLAY_FUNCTIONS } from '../overlay/Overlay';
import { ReactComponent as WelcomeIllustration } from '../../resources/img/illustrations/welcome.svg';
import { ReactComponent as WavingIllustration } from '../../resources/img/illustrations/waving.svg';

export const acceptanceOverlayItem: OverlayItem = {
	headline: translate('anonymous.waitingroom.overlay.acceptance.headline'),
	copy: translate('anonymous.waitingroom.overlay.acceptance.copy'),
	svg: WelcomeIllustration,
	illustrationBackground: 'info',
	buttonSet: [
		{
			label: translate('anonymous.waitingroom.overlay.acceptance.button'),
			function: OVERLAY_FUNCTIONS.REDIRECT,
			type: BUTTON_TYPES.AUTO_CLOSE
		}
	]
};

export const rejectionOverlayItem: OverlayItem = {
	headline: translate('anonymous.waitingroom.overlay.rejection.headline'),
	copy: translate('anonymous.waitingroom.overlay.rejection.copy'),
	svg: WavingIllustration,
	illustrationBackground: 'neutral',
	buttonSet: [
		{
			label: translate('anonymous.waitingroom.overlay.rejection.button'),
			function: OVERLAY_FUNCTIONS.REDIRECT_TO_URL,
			type: BUTTON_TYPES.PRIMARY
		}
	]
};

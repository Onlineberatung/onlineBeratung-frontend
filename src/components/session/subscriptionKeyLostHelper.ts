import { OVERLAY_FUNCTIONS, OverlayItem } from '../overlay/Overlay';
import { translate } from '../../utils/translate';
import { BUTTON_TYPES } from '../button/Button';

export const subscriptionKeyLostOverlayItem: OverlayItem = {
	illustrationBackground: 'neutral',
	headline: translate('e2ee.subscriptionKeyLost.overlay.headline'),
	copy: translate(`e2ee.subscriptionKeyLost.overlay.copy`),
	buttonSet: [
		{
			label: translate('e2ee.subscriptionKeyLost.overlay.button.close'),
			function: OVERLAY_FUNCTIONS.CLOSE,
			type: BUTTON_TYPES.PRIMARY
		}
	]
};

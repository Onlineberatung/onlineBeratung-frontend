import { OVERLAY_FUNCTIONS, OverlayItem } from '../overlay/Overlay';
import { BUTTON_TYPES } from '../button/Button';

export const subscriptionKeyLostOverlayItem: OverlayItem = {
	illustrationBackground: 'neutral',
	headline: 'e2ee.subscriptionKeyLost.overlay.headline',
	copy: `e2ee.subscriptionKeyLost.overlay.copy`,
	buttonSet: [
		{
			label: 'e2ee.subscriptionKeyLost.overlay.button.close',
			function: OVERLAY_FUNCTIONS.CLOSE,
			type: BUTTON_TYPES.PRIMARY
		}
	]
};

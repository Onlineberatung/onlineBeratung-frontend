import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { BUTTON_TYPES } from '../../button/Button';
import {
	Overlay,
	OverlayItem,
	OverlayWrapper,
	OVERLAY_FUNCTIONS
} from '../../overlay/Overlay';
import { redirectToApp } from '../../registration/autoLogin';
import { ReactComponent as WelcomeIcon } from '../../../resources/img/illustrations/welcome.svg';

export const RegistrationSuccessOverlay = () => {
	const { t: translate } = useTranslation();
	const handleOverlayAction = useCallback((buttonFunction: string) => {
		if (buttonFunction === OVERLAY_FUNCTIONS.REDIRECT_WITH_BLUR) {
			redirectToApp();
		}
	}, []);

	const overlayItemRegistrationSuccess: OverlayItem = {
		svg: WelcomeIcon,
		headline: translate('registration.overlay.success.headline'),
		copy: translate('registration.overlay.success.copy'),
		buttonSet: [
			{
				label: translate('registration.overlay.success.button'),
				function: OVERLAY_FUNCTIONS.REDIRECT_WITH_BLUR,
				type: BUTTON_TYPES.PRIMARY
			}
		]
	};

	return (
		<OverlayWrapper>
			<Overlay
				item={overlayItemRegistrationSuccess}
				handleOverlay={handleOverlayAction}
			/>
		</OverlayWrapper>
	);
};

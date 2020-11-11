import { translate } from '../../resources/scripts/i18n/translate';
import { ButtonItem, BUTTON_TYPES } from '../button/Button';
import { OverlayItem, OVERLAY_FUNCTIONS } from '../overlay/Overlay';

export const MIN_USERNAME_LENGTH = 5;

export const isStringValidEmail = (email: string) =>
	/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
		email
	);

export const getOptionOfSelectedValue = (inputOptions, selectedValue) => {
	return inputOptions.filter((item) => item.value === selectedValue)[0];
};

export const extendPostcodeToBeValid = (postcode: string) =>
	String(postcode + '00').slice(0, 5);

export const getValidationClassNames = (invalid, valid) => {
	if (invalid) {
		return 'inputField__input--invalid';
	}
	if (valid) {
		return 'inputField__input--valid';
	}
	return '';
};

export const overlayItemRegistrationSuccess: OverlayItem = {
	imgSrc: '/../resources/img/illustrations/willkommen.svg',
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

export const buttonItemSubmit: ButtonItem = {
	label: translate('registration.submitButton.label'),
	type: BUTTON_TYPES.PRIMARY
};

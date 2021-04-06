import { translate } from '../../resources/scripts/i18n/translate';
import { ButtonItem, BUTTON_TYPES } from '../button/Button';
import { OverlayItem, OVERLAY_FUNCTIONS } from '../overlay/Overlay';
import { ReactComponent as WelcomeIcon } from '../../resources/img/illustrations/willkommen.svg';

export type AccordionItemValidity = 'initial' | 'valid' | 'invalid';

export const MIN_USERNAME_LENGTH = 5;

export const isStringValidEmail = (email: string) =>
	/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
		email
	);

export const getOptionOfSelectedValue = (inputOptions, selectedValue) => {
	return inputOptions.filter((item) => item.value === selectedValue)[0];
};

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

export const buttonItemSubmit: ButtonItem = {
	label: translate('registration.submitButton.label'),
	type: BUTTON_TYPES.PRIMARY
};

export type RequiredComponents = {
	age?: any;
	state?: any;
};

export interface ResortData {
	consultingType: string;
	overline: string;
	welcomeTitle: string;
	useInformal: boolean;
	requiredComponents?: RequiredComponents;
	voluntaryComponents?: any[];
}

export type RegistrationDropdownSelectData = {
	label: string;
	options?: [];
};

export const stateData = [
	{
		value: '1',
		label: translate('user.userU25.state.1')
	},
	{
		value: '2',
		label: translate('user.userU25.state.2')
	},
	{
		value: '3',
		label: translate('user.userU25.state.3')
	},
	{
		value: '4',
		label: translate('user.userU25.state.4')
	},
	{
		value: '5',
		label: translate('user.userU25.state.5')
	},
	{
		value: '6',
		label: translate('user.userU25.state.6')
	},
	{
		value: '7',
		label: translate('user.userU25.state.7')
	},
	{
		value: '8',
		label: translate('user.userU25.state.8')
	},
	{
		value: '9',
		label: translate('user.userU25.state.9')
	},
	{
		value: '10',
		label: translate('user.userU25.state.10')
	},
	{
		value: '11',
		label: translate('user.userU25.state.11')
	},
	{
		value: '12',
		label: translate('user.userU25.state.12')
	},
	{
		value: '13',
		label: translate('user.userU25.state.13')
	},
	{
		value: '14',
		label: translate('user.userU25.state.14')
	},
	{
		value: '15',
		label: translate('user.userU25.state.15')
	},
	{
		value: '16',
		label: translate('user.userU25.state.16')
	},
	{
		value: '0',
		label: translate('user.userU25.state.0')
	}
];

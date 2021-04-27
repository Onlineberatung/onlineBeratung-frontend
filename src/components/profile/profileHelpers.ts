import { ButtonItem, BUTTON_TYPES } from '../button/Button';
import {
	translate,
	getResortTranslation
} from '../../resources/scripts/i18n/translate';
import { UserDataInterface } from '../../globalState';
import { OverlayItem, OVERLAY_FUNCTIONS } from '../overlay/Overlay';
import { ReactComponent as CheckIcon } from '../../resources/img/illustrations/check.svg';
import { ReactComponent as XIcon } from '../../resources/img/illustrations/x.svg';
import { isGroupChatConsultingType } from '../../resources/scripts/helpers/resorts';

export const convertUserDataObjectToArray = (object) => {
	const array = [];
	Object.keys(object).forEach((key) => {
		let test = {
			type: key,
			value:
				object[key] && typeof object[key] === 'object'
					? convertUserDataObjectToArray(object[key])
					: object[key]
		};
		array.push(test);
	});
	return array;
};

export const getAddictiveDrugsTranslatable = (addictiveDrugs) => {
	return addictiveDrugs ? addictiveDrugs.toString().split(',') : null;
};

export const getUserDataTranslateBase = (consultingType: number) => {
	return consultingType === 0 ? 'user.userAddiction' : 'user.userU25';
};

export const buttonSetRegistration: ButtonItem = {
	label: translate('profile.data.register.buttonLabel'),
	type: BUTTON_TYPES.LINK
};

export enum REGISTRATION_STATUS_KEYS {
	REGISTERED = 'REGISTERED',
	UNREGISTERED = 'UNREGISTERED'
}
const forAskerRegistrationExcludedConsultingTypes = [1, 19, 20];
export const getConsultingTypesForRegistrationStatus = (
	userData: UserDataInterface,
	registrationStatus: REGISTRATION_STATUS_KEYS
) => {
	return Object.keys(userData.consultingTypes)
		.map((key) => {
			return {
				consultingType: key,
				data: userData.consultingTypes[key]
			};
		})
		.filter((value) => {
			const validationForRegistrationStatus =
				registrationStatus === REGISTRATION_STATUS_KEYS.REGISTERED
					? value.data.isRegistered
					: !forAskerRegistrationExcludedConsultingTypes.includes(
							parseInt(value.consultingType)
					  ) && !value.data.isRegistered;
			return validationForRegistrationStatus;
		});
};

export const consultingTypeSelectOptionsSet = (userData: UserDataInterface) => {
	const unregisteredConsultingTypesData = getConsultingTypesForRegistrationStatus(
		userData,
		REGISTRATION_STATUS_KEYS.UNREGISTERED
	);
	return unregisteredConsultingTypesData.map((value) => {
		const currentConsultingType = parseInt(value.consultingType);
		return {
			value: value.consultingType,
			label: isGroupChatConsultingType(currentConsultingType)
				? getResortTranslation(currentConsultingType, false, true)
				: getResortTranslation(currentConsultingType)
		};
	});
};

export const overlayItemNewRegistrationSuccess: OverlayItem = {
	svg: CheckIcon,
	headline: translate('profile.data.registerSuccess.overlay.headline'),
	buttonSet: [
		{
			label: translate(
				'profile.data.registerSuccess.overlay.button1Label'
			),
			function: OVERLAY_FUNCTIONS.REDIRECT,
			type: BUTTON_TYPES.PRIMARY
		},
		{
			label: translate(
				'profile.data.registerSuccess.overlay.button2Label'
			),
			function: OVERLAY_FUNCTIONS.LOGOUT,
			type: BUTTON_TYPES.LINK
		}
	]
};

export const overlayItemNewRegistrationError: OverlayItem = {
	svg: XIcon,
	headline: translate('profile.data.registerError.overlay.headline'),
	buttonSet: [
		{
			label: translate('profile.data.registerError.overlay.buttonLabel'),
			function: OVERLAY_FUNCTIONS.CLOSE,
			type: BUTTON_TYPES.PRIMARY
		}
	]
};

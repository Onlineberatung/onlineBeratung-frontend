import { ButtonItem, BUTTON_TYPES } from '../button/Button';
import { translate } from '../../utils/translate';
import {
	UserDataInterface,
	ConsultingTypeBasicInterface,
	getConsultingType
} from '../../globalState';
import { OverlayItem, OVERLAY_FUNCTIONS } from '../overlay/Overlay';
import { ReactComponent as CheckIcon } from '../../resources/img/illustrations/check.svg';
import { ReactComponent as XIcon } from '../../resources/img/illustrations/x.svg';

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
export const getConsultingTypesForRegistrationStatus = (
	userData: UserDataInterface,
	consultingTypes: Array<ConsultingTypeBasicInterface>,
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
					: consultingTypes.find(
							(cur) => cur.id === parseInt(value.consultingType)
					  )?.isSubsequentRegistrationAllowed &&
					  !value.data.isRegistered;
			return validationForRegistrationStatus;
		});
};

export const consultingTypeSelectOptionsSet = (
	userData: UserDataInterface,
	consultingTypes: Array<ConsultingTypeBasicInterface>
) => {
	const unregisteredConsultingTypesData =
		getConsultingTypesForRegistrationStatus(
			userData,
			consultingTypes,
			REGISTRATION_STATUS_KEYS.UNREGISTERED
		);
	return unregisteredConsultingTypesData.map((value) => {
		const id = parseInt(value.consultingType);
		const consultingType = getConsultingType(consultingTypes, id);

		return {
			value: value.consultingType,
			label: consultingType.titles.registrationDropdown
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
	illustrationBackground: 'error',
	headline: translate('profile.data.registerError.overlay.headline'),
	buttonSet: [
		{
			label: translate('profile.data.registerError.overlay.buttonLabel'),
			function: OVERLAY_FUNCTIONS.CLOSE,
			type: BUTTON_TYPES.PRIMARY
		}
	]
};

export const hasAskerEmailFeatures = (
	userData: UserDataInterface,
	consultingTypes: Array<ConsultingTypeBasicInterface>
): boolean => {
	const registeredConsultingTypes = getConsultingTypesForRegistrationStatus(
		userData,
		consultingTypes,
		REGISTRATION_STATUS_KEYS.REGISTERED
	);

	return registeredConsultingTypes.some(
		(element) =>
			consultingTypes.find(
				(cur) => cur.id === parseInt(element.consultingType)
			)?.isSetEmailAllowed
	);
};

export const isUniqueLanguage = (value, index, self) => {
	return self.indexOf(value) === index;
};

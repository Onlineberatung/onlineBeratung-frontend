import { ButtonItem, BUTTON_TYPES } from '../../button/ts/Button';
import {
	translate,
	getResortTranslation
} from '../../../resources/ts/i18n/translate';
import { UserDataInterface } from '../../../globalState';

export const convertUserDataObjectToArray = (object) => {
	const array = [];
	Object.keys(object).map(function (key) {
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
	type: BUTTON_TYPES.PRIMARY
};

const forAskerRegistrationExcludedConsultingTypes = [1, 15];
export const consultingTypeSelectOptionsSet = (userData: UserDataInterface) => {
	const unregisteredConsultingTypesData = Object.keys(
		userData.consultingTypes
	)
		.map((key) => {
			return {
				consultingType: key,
				data: userData.consultingTypes[key]
			};
		})
		.filter(
			(value) =>
				!forAskerRegistrationExcludedConsultingTypes.includes(
					parseInt(value.consultingType)
				) && !value.data.isRegistered
		);
	return unregisteredConsultingTypesData.map((value) => {
		return {
			value: value.consultingType,
			label: getResortTranslation(parseInt(value.consultingType))
		};
	});
};

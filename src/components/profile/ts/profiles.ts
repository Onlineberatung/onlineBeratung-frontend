import { SessionUserDataInterface } from '../../../globalState';
import { array } from 'prop-types';

//TODO: rm on profile refactor
export interface ProfileData {
	absenceMessage: string;
	absent: boolean;
	agencies: [
		{
			id: number;
			name: string;
			postcode: number;
			description: string;
			teamAgency: false;
		}
	];
	email: string;
	firstName: string;
	lastName: string;
	inTeamAgency: boolean;
	userName: string;
	userRoles: Array<string>;
	userId: string;
}

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

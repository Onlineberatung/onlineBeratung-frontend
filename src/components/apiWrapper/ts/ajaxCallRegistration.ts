import { config } from '../../../resources/ts/config';
import { initRegistrationOverlay } from '../../overlay/ts/handleRegistrationOverlay';
import { warningLabelForTranslatableAndParentId } from '../../registrationFormular/ts/warningLabels';
import { generateCsrfToken } from '../../../resources/ts/helpers/generateCsrfToken';
import { autoLogin } from '../../registration/ts/autoLogin';
import {
	getErrorCaseForStatus,
	redirectToErrorPage
} from '../../errorPage/ts/errorHandling';
import { getConsultingTypeFromRegistration } from '../../../resources/ts/helpers/resorts';
import { hasPostcodeToBeExtended } from '../../postcodeSuggestion/ts/postcodeSuggestionHelper';
import { removeAllCookies } from '../../sessionCookie/ts/accessSessionCookie';
import { extendPostcodeToBeValid } from '../../registration/ts/registrationHelper';

// export const initRegistrationCall = (e: Event) => {
// 	const registrationData = getRegistrationDataObject();
// 	postRegistration(config.endpoints.registerAsker, registrationData);
// };

// const getRegistrationDataObject = () => {
// 	const postcode = getValidPostcode();
// 	const email = document.getElementById('email') as HTMLInputElement;
// 	const addictiveDrugs = getAddictiveDrugs();
// 	const relation = getSelectedRadioButton('relation');
// 	const age = document.getElementById('ageSelect') as HTMLInputElement;
// 	const state = document.getElementById('stateSelect') as HTMLInputElement;
// 	const gender = getSelectedRadioButton('gender');
// 	const consultingType = getConsultingTypeFromRegistration().toString();

// 	const registrationData = {
// 		username: (document.getElementById('username') as HTMLInputElement)
// 			.value,
// 		postcode: postcode,
// 		password: encodeURIComponent(
// 			(document.getElementById('passwordInput') as HTMLInputElement).value
// 		),
// 		...(email && email.value != '' ? { email: email.value } : null),
// 		...(addictiveDrugs ? { addictiveDrugs: addictiveDrugs } : null),
// 		...(relation ? { relation: relation } : null),
// 		...(age && age.value != '' ? { age: age.value } : null),
// 		...(state && state.value != '' ? { state: state.value } : null),
// 		...(gender ? { gender: gender } : null),
// 		termsAccepted: (document.getElementById(
// 			'termsAccepted'
// 		) as HTMLInputElement).checked.toString(),
// 		consultingType: consultingType,
// 		agencyId: document.getElementById('postcode').dataset.agencyId
// 	};
// 	return registrationData;
// };

// const getValidPostcode = () => {
// 	let validPostcode;
// 	const postcode = (document.getElementById('postcode') as HTMLInputElement)
// 		.value;
// 	if (!parseInt(postcode)) {
// 		let inputVal = document.getElementById('postcode').dataset.inputVal;
// 		if (hasPostcodeToBeExtended(inputVal.length)) {
// 			inputVal = extendPostcodeToBeValid(inputVal);
// 		}
// 		validPostcode = inputVal;
// 	} else {
// 		validPostcode = postcode;
// 	}
// 	return validPostcode;
// };

// const getAddictiveDrugs = () => {
// 	const inputElements = document.querySelectorAll('.multiselectItem input');
// 	let addictiveDrugs = [];
// 	Array.from(inputElements).forEach((inputElement) => {
// 		const input = inputElement as HTMLInputElement;
// 		input.checked ? addictiveDrugs.push(input.value) : '';
// 	});
// 	return addictiveDrugs.join(',');
// };

// const getSelectedRadioButton = (collectionName: string) => {
// 	const radioElements = document.getElementsByName(collectionName);
// 	let radioValue = '';
// 	Array.from(radioElements).forEach((radioElement) => {
// 		const radioItem = radioElement as HTMLInputElement;
// 		radioItem.checked ? (radioValue = radioItem.value) : '';
// 	});
// 	return radioValue;
// };

export const postRegistration = (url: string, data: {}) => {
	let isRequestInProgress = false;
	removeAllCookies();
	if (isRequestInProgress) {
		return null;
	}
	isRequestInProgress = true;
	const xhr = new XMLHttpRequest();
	xhr.open('POST', url);
	xhr.onreadystatechange = function () {
		if (xhr.readyState > 3 && xhr.status == 201) {
			autoLogin(
				data['username'],
				decodeURIComponent(data['password']),
				false
			);
			initRegistrationOverlay();
		} else if (xhr.readyState > 3 && xhr.status == 409) {
			handleConfirmationError(xhr.response);
			isRequestInProgress = false;
		} else if (
			xhr.readyState > 3 &&
			xhr.status != 201 &&
			xhr.status != 409
		) {
			const error = getErrorCaseForStatus(xhr.status);
			redirectToErrorPage(error);
		}
	};
	const csrfToken = generateCsrfToken();

	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.setRequestHeader('X-CSRF-TOKEN', csrfToken);
	xhr.withCredentials = true;
	xhr.send(JSON.stringify(data));
	return xhr;
};

export const handleConfirmationError = (data: string) => {
	window.scrollTo(0, 0);
	if (data.includes('"usernameAvailable":0')) {
		warningLabelForTranslatableAndParentId(
			'warningLabels.username.unavailable',
			'username'
		);
	}
	if (data.includes('"emailAvailable":0')) {
		warningLabelForTranslatableAndParentId(
			'warningLabels.email.unavailable',
			'email'
		);
	}
};

import {
	inputValuesFit,
	strengthIndicator
} from '../../passwordField/ts/validateInputValue';
import {
	removeWarningLabels,
	warningLabelForTranslatableAndParentId,
	removeCheckboxWarningLabel
} from '../../registrationFormular/ts/warningLabels';
import { initRegistrationCall } from '../../apiWrapper/ts/';
import {
	setFirstAgencyId,
	validPostcodeLengthForConsultingType,
	hasPostcodeToBeExtended
} from '../../postcodeSuggestion/ts/postcodeSuggestionHelper';
import {
	isU25Registration,
	isGenericConsultingType,
	getConsultingTypeFromRegistration,
	hasConsultingTypeLongPostcodeValidation
} from '../../../resources/ts/helpers/resorts';

export const handleRegistrationSubmit = (e: Event) => {
	e.preventDefault();
	// removeWarningLabels();
	// removeCheckboxWarningLabel();

	// handleUsernameOnSubmit(); //
	handlePostcodeOnSubmit(); // -> validation muss noch in react component ergänzt werden
	if (isU25Registration()) {
		handleAgeOnSubmit();
		handleStateOnSubmit();
	}
	// handleEmailOnSubmit();
	// handleTermsAcceptedOnSubmit();
	handlePasswordFieldOnSubmit(e);
};

const handleUsernameOnSubmit = () => {
	const usernameValue = (document.getElementById(
		'username'
	) as HTMLInputElement).value;
	const usernameLength = usernameValue.length;

	if (usernameLength <= 0) {
		warningLabelForTranslatableAndParentId(
			'warningLabels.username.missing',
			'username'
		);
		return false;
	} else if (usernameLength < 5 || usernameLength > 30) {
		warningLabelForTranslatableAndParentId(
			'warningLabels.username.invalid',
			'username'
		);
		return false;
	} else {
		return true;
	}
};

export const extendPostcodeToBeValid = (postcode: string) =>
	String(postcode + '00').slice(0, 5);

const handlePostcodeOnSubmit = () => {
	const postcodeInput = document.getElementById(
		'postcode'
	) as HTMLInputElement;
	const agencyId = postcodeInput.dataset.agencyId;
	const postcodeValue = postcodeInput.value;
	let postcodeInt = postcodeValue.toString();
	const postcodeLength = postcodeValue.length;

	if (postcodeLength == 0) {
		// warningLabelForTranslatableAndParentId(
		// 	'warningLabels.postcode.missing',
		// 	'postcode'
		// );
	} else if (!validPostcodeLengthForConsultingType(postcodeLength)) {
		// POSTCODE VALIDATION MUSS IN DER REACT COMPONENTE NOCH NACHGEZOGEN WERDEN
		warningLabelForTranslatableAndParentId(
			'warningLabels.postcode.invalid',
			'postcode'
		);
	}

	const postcodeFallbackError = postcodeInput.getAttribute(
		'data-postcodefallback'
	);
	if (postcodeFallbackError) {
		// POSTCODE VALIDATION MUSS IN DER REACT COMPONENTE NOCH NACHGEZOGEN WERDEN
		warningLabelForTranslatableAndParentId(
			'warningLabels.postcode.invalid',
			'postcode'
		);
	}

	// -> DONE IN POSTCODE SUGGESTION

	// else if (
	// 	!hasConsultingTypeLongPostcodeValidation() &&
	// 	!postcodeFallbackError &&
	// 	hasPostcodeToBeExtended(postcodeLength) &&
	// 	parseInt(postcodeValue)
	// ) {
	//
	// 	// postcodeInput.value = extendPostcodeToBeValid(postcodeInt);
	// }

	if (!agencyId) {
		setFirstAgencyId();
	}
};

const handleAgeOnSubmit = () => {
	const age = (document.getElementById('ageSelect') as HTMLInputElement)
		.value;
	if (age === '') {
		warningLabelForTranslatableAndParentId(
			'warningLabels.age.missing',
			'ageSelect__wrapper'
		);
	}
};

const handleStateOnSubmit = () => {
	const state = (document.getElementById('stateSelect') as HTMLInputElement)
		.value;
	if (state === '') {
		warningLabelForTranslatableAndParentId(
			'warningLabels.state.missing',
			'stateSelect__wrapper'
		);
	}
};

const handleTermsAcceptedOnSubmit = () => {
	const termsAccepted = (document.getElementById(
		'termsAccepted'
	) as HTMLInputElement).checked;
	if (!termsAccepted) {
		warningLabelForTranslatableAndParentId(
			'warningLabels.terms.unaccepted',
			'termsAcceptedLabel'
		);
	}
};

const handleEmailOnSubmit = () => {
	if (!document.getElementById('email')) return;
	const chosenEmail = (document.getElementById('email') as HTMLInputElement)
		.value;
	if (chosenEmail) {
		const valid = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
			chosenEmail
		);
		if (!valid) {
			warningLabelForTranslatableAndParentId(
				'warningLabels.email.invalid',
				'email'
			);
		}
	}
};

const handlePasswordFieldOnSubmit = (e: Event) => {
	const passwordValue = (document.getElementById(
		'passwordInput'
	) as HTMLInputElement).value;
	const passwordConfirmationValue = (document.getElementById(
		'passwordConfirmation'
	) as HTMLInputElement).value;

	const passwordSet = passwordValue.length > 0;
	const passwordStrong = strengthIndicator(passwordValue) >= 4;
	const passwordsFit = inputValuesFit(
		passwordValue,
		passwordConfirmationValue
	);

	let passwordsValid;
	passwordsValid = passwordSet && passwordStrong && passwordsFit;

	if (passwordsValid && requiredDataSet()) {
		initRegistrationCall(e);
	} else {
		if (!passwordSet) {
			warningLabelForTranslatableAndParentId(
				'warningLabels.password.missing',
				'passwordInput'
			);
		} else if (!passwordStrong) {
			warningLabelForTranslatableAndParentId(
				'warningLabels.password.weak',
				'passwordInput'
			);
		}
		if (!passwordsFit) {
			warningLabelForTranslatableAndParentId(
				'warningLabels.password.confirmation.wrong',
				'passwordConfirmation'
			);
		}
		e.preventDefault();
	}
};

const requiredDataSet = () => {
	const username = handleUsernameOnSubmit();
	const postcodeElement = document.getElementById(
		'postcode'
	) as HTMLInputElement;
	const postcode = postcodeElement.value;
	const agencyId = postcodeElement.dataset.agencyId;
	const postcodeFallbackError = postcodeElement.getAttribute(
		'data-postcodefallback'
	);
	const age = !isGenericConsultingType(getConsultingTypeFromRegistration())
		? (document.getElementById('ageSelect') as HTMLInputElement).value
		: null;
	const state = isU25Registration()
		? (document.getElementById('stateSelect') as HTMLInputElement).value
		: null;
	const termsAccepted = (document.getElementById(
		'termsAccepted'
	) as HTMLInputElement).checked;

	if (!username || postcode === '' || agencyId === '') {
		return false;
	} else if (!validPostcodeLengthForConsultingType(postcode.length)) {
		return false;
	} else if (postcodeFallbackError) {
		return false;
	} else if (isU25Registration() && (age === '' || state === '')) {
		return false;
	} else if (!termsAccepted) {
		return false;
	} else {
		return true;
	}
};

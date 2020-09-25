import { handleRegistrationSubmit } from './handleRegistration';
import { initPasswordToggle } from './togglePasswordView';
import { prefillPostcode } from './prefillPostcode';
import {
	initInputWarningLabelHandler,
	handleWarningLabelOnCheckbox
} from './warningLabels';
import { addPostcodeListener } from '../../postcodeSuggestion/ts/postcodeSuggestionHelper';

{
	addPostcodeListener('postcode');
	const submitRegistrationButton = document.getElementById(
		'submitRegistration'
	);
	submitRegistrationButton.addEventListener(
		'click',
		handleRegistrationSubmit
	);

	initPasswordToggle();

	prefillPostcode();

	initInputWarningLabelHandler();

	const checkboxes = document.querySelectorAll('.checkbox__wrapper');
	Array.from(checkboxes).forEach((checkbox) => {
		checkbox.addEventListener('click', handleWarningLabelOnCheckbox);
	});
}

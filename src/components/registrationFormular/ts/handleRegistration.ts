import {
	inputValuesFit,
	strengthIndicator
} from '../../passwordField/ts/validateInputValue';
import { warningLabelForTranslatableAndParentId } from '../../registrationFormular/ts/warningLabels';
import {
	setFirstAgencyId,
	validPostcodeLengthForConsultingType
} from '../../postcodeSuggestion/ts/postcodeSuggestionHelper';

export const handleRegistrationSubmit = (e: Event) => {
	handlePostcodeOnSubmit(); // -> validation muss noch in react component ergänzt werden
};

const handlePostcodeOnSubmit = () => {
	const postcodeInput = document.getElementById(
		'postcode'
	) as HTMLInputElement;
	const agencyId = postcodeInput.dataset.agencyId;
	const postcodeValue = postcodeInput.value;
	const postcodeLength = postcodeValue.length;

	if (postcodeLength == 0) {
	} else if (!validPostcodeLengthForConsultingType(postcodeLength)) {
		warningLabelForTranslatableAndParentId(
			'warningLabels.postcode.invalid',
			'postcode'
		);
	}

	const postcodeFallbackError = postcodeInput.getAttribute(
		'data-postcodefallback'
	);
	if (postcodeFallbackError) {
		warningLabelForTranslatableAndParentId(
			'warningLabels.postcode.invalid',
			'postcode'
		);
	}
	if (!agencyId) {
		setFirstAgencyId();
	}
};

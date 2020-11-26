import {
	getConsultingTypeFromRegistration,
	hasConsultingTypeLongPostcodeValidation
} from '../../resources/scripts/helpers/resorts';

export const VALID_POSTCODE_LENGTH = {
	SHORT: 3,
	LONG: 5,
	MAX: 5
};

export const validPostcodeLengthForConsultingType = (
	postcodeLength: number,
	consultingType = getConsultingTypeFromRegistration()
) => {
	if (hasConsultingTypeLongPostcodeValidation(consultingType)) {
		return postcodeLength === VALID_POSTCODE_LENGTH.LONG;
	} else {
		return postcodeLength >= VALID_POSTCODE_LENGTH.SHORT;
	}
};

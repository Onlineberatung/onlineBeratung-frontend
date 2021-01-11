import { config } from '../../resources/scripts/config';

export const VALID_POSTCODE_LENGTH = 5;

const consultingTypesToAutoselectAgency = ['11', '12', '13', '15', '17'];
export const autoselectAgencyForConsultingType = (
	consultingType: number
): boolean => {
	return consultingTypesToAutoselectAgency.includes(
		consultingType?.toString()
	);
};

const consultingTypesToAutoselectPostcode = ['1', '15', '19'];
export const autoselectPostcodeForConsultingType = (
	consultingType: number
): boolean => {
	return consultingTypesToAutoselectPostcode.includes(
		consultingType?.toString()
	);
};

export const POSTCODE_FALLBACK_LINKS = {
	8: config.endpoints.registrationDisabilityPostcodeFallback,
	16: config.endpoints.registrationMigrationPostcodeFallback,
	18: config.endpoints.registrationHospicePostcodeFallback,
	20: config.endpoints.registrationMenPostcodeFallback
};

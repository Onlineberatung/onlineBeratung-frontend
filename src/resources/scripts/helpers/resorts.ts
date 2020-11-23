import { config } from '../config';

export const getConsultingTypeFromRegistration = () => {
	const registrationRoot = document.getElementById('registrationRoot');
	return registrationRoot?.dataset?.consultingtype
		? parseInt(registrationRoot.dataset.consultingtype)
		: undefined;
};

export const isU25Registration = (): boolean =>
	getConsultingTypeFromRegistration() === 1;

export const isGenericConsultingType = (currentType: number): boolean => {
	const genericTypes = [
		2,
		3,
		4,
		5,
		6,
		7,
		8,
		9,
		10,
		11,
		12,
		13,
		14,
		15,
		16,
		17,
		18,
		19
	];
	return genericTypes.includes(currentType);
};

export const hasConsultingTypeLongPostcodeValidation = (
	consultingType: number | undefined = getConsultingTypeFromRegistration()
): boolean => {
	const typesUsingLongPostcodeValidation = ['12', '17'];
	return consultingType
		? typesUsingLongPostcodeValidation.includes(consultingType.toString())
		: false;
};

export const hasPreselectedAgencyFallback = (
	consultingType: number | undefined = getConsultingTypeFromRegistration()
): boolean => {
	const typesWithPreselectedAgencyFallback = ['11', '13', '15'];
	return consultingType
		? typesWithPreselectedAgencyFallback.includes(consultingType.toString())
		: false;
};

export const getResortKeyForConsultingType = (currentType: number) => {
	return RESORT_KEYS[currentType] || 'default';
};

export const RESORT_KEYS = {
	0: 'addiction',
	1: 'u25',
	2: 'pregnancy',
	3: 'parenting',
	4: 'cure',
	5: 'debt',
	6: 'social',
	7: 'seniority',
	8: 'disability',
	9: 'planB',
	10: 'law',
	11: 'offender',
	12: 'aids',
	13: 'rehabilitation',
	14: 'children',
	15: 'kreuzbund',
	16: 'migration',
	17: 'emigration',
	18: 'hospice',
	19: 'regional'
};

export const POSTCODE_FALLBACK_LINK = {
	8: config.endpoints.registrationDisabilityPostcodeFallback,
	16: config.endpoints.registrationMigrationPostcodeFallback,
	18: config.endpoints.registrationHospicePostcodeFallback
};

export const AGENCY_FALLBACK_LINK = {
	11: config.endpoints.registrationOffenderRedirect,
	13: config.endpoints.registrationRehabilitationRedirect,
	15: config.endpoints.registrationKreuzbundRedirect
};

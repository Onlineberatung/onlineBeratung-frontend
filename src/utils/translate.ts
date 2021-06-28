import { getValueFromCookie } from '../components/sessionCookie/accessSessionCookie';
import defaultLocale from '../resources/scripts/i18n/defaultLocale';
import informalLocale from '../resources/scripts/i18n/informalLocale';

export const getTranslation = (
	translatable: string,
	informal: boolean = false
): any => {
	let config = translatable.split('.')[0];
	return (informal ? informalLocale : defaultLocale)[config][
		translatable.split('.').slice(1).join('.')
	];
};

export const translate = (translatable: string): any => {
	let informal = Boolean(getValueFromCookie('useInformal'));
	return (
		getTranslation(translatable, informal) ||
		'[NO TRANSLATION FOR ' + translatable + ']'
	);
};

export const handleNumericTranslation = (
	topic: string,
	value: string,
	number: number
) => {
	const translateVal = (topic + '.' + value + '.' + number).toString();
	const translateStr = translateVal.toString();
	return translate(translateStr);
};

export const getAddictiveDrugsString = (addictiveDrugs: string[]) => {
	let drugString = '';
	addictiveDrugs.forEach((drug, i) => {
		if (i > 0) {
			drugString += ', ';
		}
		drugString += handleNumericTranslation(
			'user.userAddiction',
			'addictiveDrugs',
			parseInt(drug)
		);
	});
	return drugString;
};

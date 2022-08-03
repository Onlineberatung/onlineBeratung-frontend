import { getValueFromCookie } from '../components/sessionCookie/accessSessionCookie';
import defaultLocale from '../resources/scripts/i18n/defaultLocale';
import informalLocale from '../resources/scripts/i18n/informalLocale';

export const getTranslation = (
	translatable: string,
	informal: boolean = false,
	tokens?: { [key: string]: string }
): any => {
	let [config, ...keys] = translatable.split('.');
	const text = (informal ? informalLocale : defaultLocale)[config][
		keys.join('.')
	];
	return Object.keys(tokens ?? {}).reduce(
		(acc, token) => acc?.replace(`%${token}%`, tokens[token]),
		text
	);
};

export const translate = (
	translatable: string,
	tokens?: { [key: string]: string }
): any => {
	let informal = Boolean(getValueFromCookie('useInformal'));
	return (
		getTranslation(translatable, informal, tokens) ||
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

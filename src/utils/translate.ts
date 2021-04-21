import app from '../resources/scripts/i18n/de/app';
import absence from '../resources/scripts/i18n/de/absence';
import absenceInformal from '../resources/scripts/i18n/de/absenceInformal';
import attachments from '../resources/scripts/i18n/de/attachments';
import attachmentsInformal from '../resources/scripts/i18n/de/attachmentsInformal';
import chatFlyout from '../resources/scripts/i18n/de/chatFlyout';
import consultant from '../resources/scripts/i18n/de/consultant';
import deleteAccount from '../resources/scripts/i18n/de/deleteAccount';
import deleteAccountInformal from '../resources/scripts/i18n/de/deleteAccountInformal';
import enquiry from '../resources/scripts/i18n/de/enquiry';
import enquiryInformal from '../resources/scripts/i18n/de/enquiryInformal';
import furtherSteps from '../resources/scripts/i18n/de/furtherSteps';
import furtherStepsInformal from '../resources/scripts/i18n/de/furtherStepsInformal';
import groupChat from '../resources/scripts/i18n/de/groupChat';
import groupChatInformal from '../resources/scripts/i18n/de/groupChatInformal';
import login from '../resources/scripts/i18n/de/login';
import message from '../resources/scripts/i18n/de/message';
import monitoring from '../resources/scripts/i18n/de/monitoring';
import navigation from '../resources/scripts/i18n/de/navigation';
import profile from '../resources/scripts/i18n/de/profile';
import profileInformal from '../resources/scripts/i18n/de/profileInformal';
import registration from '../resources/scripts/i18n/de/registration';
import registrationInformal from '../resources/scripts/i18n/de/registrationInformal';
import resort from '../resources/scripts/i18n/de/resort';
import session from '../resources/scripts/i18n/de/session';
import sessionInformal from '../resources/scripts/i18n/de/sessionInformal';
import sessionList from '../resources/scripts/i18n/de/sessionList';
import sessionListInformal from '../resources/scripts/i18n/de/sessionListInformal';
import statusOverlay from '../resources/scripts/i18n/de/statusOverlay';
import statusOverlayInformal from '../resources/scripts/i18n/de/statusOverlayInformal';
import typingIndicator from '../resources/scripts/i18n/de/typingIndicator';
import user from '../resources/scripts/i18n/de/user';
import userProfile from '../resources/scripts/i18n/de/userProfile';
import videoCall from '../resources/scripts/i18n/de/videoCall';
import videoCallInformal from '../resources/scripts/i18n/de/videoCallInformal';
import { getResortKeyForConsultingType } from './resorts';
import { getTokenFromCookie } from '../components/sessionCookie/accessSessionCookie';

const defaultLocale: any = {
	app,
	absence,
	attachments,
	chatFlyout,
	consultant,
	deleteAccount,
	enquiry,
	furtherSteps,
	groupChat,
	login,
	message,
	monitoring,
	navigation,
	profile,
	registration,
	resort,
	session,
	sessionList,
	statusOverlay,
	typingIndicator,
	user,
	userProfile,
	videoCall
};

const informalLocale: any = {
	...defaultLocale,
	absence: { ...absence, ...absenceInformal },
	attachments: { ...attachments, ...attachmentsInformal },
	deleteAccount: { ...deleteAccount, ...deleteAccountInformal },
	groupChat: { ...groupChat, ...groupChatInformal },
	enquiry: { ...enquiry, ...enquiryInformal },
	furtherSteps: { ...furtherSteps, ...furtherStepsInformal },
	profile: { ...profile, ...profileInformal },
	registration: { ...registration, ...registrationInformal },
	session: { ...session, ...sessionInformal },
	sessionList: { ...sessionList, ...sessionListInformal },
	statusOverlay: { ...statusOverlay, ...statusOverlayInformal },
	videoCall: { ...videoCall, ...videoCallInformal }
};

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
	let informal = Boolean(getTokenFromCookie('useInformal'));
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

export const getResortTranslation = (
	consultingType: number,
	alt: boolean = false
) => {
	const translatable = `resort.${getResortKeyForConsultingType(
		consultingType
	)}${alt ? '.alt' : ''}`;
	return translate(translatable);
};

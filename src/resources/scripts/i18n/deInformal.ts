import absence from './de/absence';
import absenceInformal from './de/absenceInformal';
import attachments from './de/attachments';
import attachmentsInformal from './de/attachmentsInformal';
import deleteAccount from './de/deleteAccount';
import deleteAccountInformal from './de/deleteAccountInformal';
import enquiry from './de/enquiry';
import enquiryInformal from './de/enquiryInformal';
import furtherSteps from './de/furtherSteps';
import furtherStepsInformal from './de/furtherStepsInformal';
import groupChat from './de/groupChat';
import groupChatInformal from './de/groupChatInformal';
import profile from './de/profile';
import profileInformal from './de/profileInformal';
import registration from './de/registration';
import registrationInformal from './de/registrationInformal';
import session from './de/session';
import sessionInformal from './de/sessionInformal';
import sessionList from './de/sessionList';
import sessionListInformal from './de/sessionListInformal';
import statusOverlay from './de/statusOverlay';
import statusOverlayInformal from './de/statusOverlayInformal';
import videoCall from './de/videoCall';
import videoCallInformal from './de/videoCallInformal';
import defaultLocale from './defaultLocale';

const informalLocale = {
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

export default informalLocale;

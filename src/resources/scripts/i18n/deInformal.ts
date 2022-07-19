import absence from './de/absence';
import absenceInformal from './de/absenceInformal';
import archive from './de/archive';
import archiveInformal from './de/archiveInformal';
import attachments from './de/attachments';
import attachmentsInformal from './de/attachmentsInformal';
import appointments from './de/appointments';
import appointmentsInformal from './de/appointmentsInformal';
import deleteAccount from './de/deleteAccount';
import deleteAccountInformal from './de/deleteAccountInformal';
import deleteSession from './de/deleteSession';
import deleteSessionInformal from './de/deleteSessionInformal';
import enquiry from './de/enquiry';
import enquiryInformal from './de/enquiryInformal';
import furtherSteps from './de/furtherSteps';
import furtherStepsInformal from './de/furtherStepsInformal';
import groupChat from './de/groupChat';
import groupChatInformal from './de/groupChatInformal';
import profile from './de/profile';
import profileInformal from './de/profileInformal';
import notifications from './de/notifications';
import notificationsInformal from './de/notificationsInformal';
import registration from './de/registration';
import registrationInformal from './de/registrationInformal';
import session from './de/session';
import sessionInformal from './de/sessionInformal';
import sessionList from './de/sessionList';
import sessionListInformal from './de/sessionListInformal';
import statusOverlay from './de/statusOverlay';
import statusOverlayInformal from './de/statusOverlayInformal';
import twoFactorAuth from './de/twoFactorAuth';
import twoFactorAuthInformal from './de/twoFactorAuthInformal';
import videoCall from './de/videoCall';
import videoCallInformal from './de/videoCallInformal';
import videoConference from './de/videoConference';
import videoConferenceInformal from './de/videoConferenceInformal';
import e2ee from './de/e2ee';
import e2eeInformal from './de/e2eeInformal';
import aliases from './de/aliases';
import aliasesInformal from './de/aliasesInformal';
import de from './de';
import help from './de/help';
import helpInformal from './de/helpInformal';

const informalLocale = {
	...de,
	absence: { ...absence, ...absenceInformal },
	archive: { ...archive, ...archiveInformal },
	attachments: { ...attachments, ...attachmentsInformal },
	appointments: { ...appointments, ...appointmentsInformal },
	deleteAccount: { ...deleteAccount, ...deleteAccountInformal },
	deleteSession: { ...deleteSession, ...deleteSessionInformal },
	groupChat: { ...groupChat, ...groupChatInformal },
	enquiry: { ...enquiry, ...enquiryInformal },
	furtherSteps: { ...furtherSteps, ...furtherStepsInformal },
	profile: { ...profile, ...profileInformal },
	notifications: { ...notifications, ...notificationsInformal },
	registration: { ...registration, ...registrationInformal },
	session: { ...session, ...sessionInformal },
	sessionList: { ...sessionList, ...sessionListInformal },
	statusOverlay: { ...statusOverlay, ...statusOverlayInformal },
	twoFactorAuth: { ...twoFactorAuth, ...twoFactorAuthInformal },
	videoCall: { ...videoCall, ...videoCallInformal },
	videoConference: { ...videoConference, ...videoConferenceInformal },
	e2ee: { ...e2ee, ...e2eeInformal },
	aliases: { ...aliases, ...aliasesInformal },
	help: { ...help, ...helpInformal }
};

export default informalLocale;

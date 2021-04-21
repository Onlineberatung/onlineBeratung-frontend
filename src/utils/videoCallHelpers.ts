import { getTokenFromCookie } from '../components/sessionCookie/accessSessionCookie';

export type NotificationType = 'call';

export const getVideoCallUrl = (
	url: string,
	isVideoActivated: boolean = false,
	isInitiator: boolean = false
) => {
	return `${url}&isInitiator=${isInitiator}#config.startWithVideoMuted=${!isVideoActivated}`;
};

export const currentUserWasVideoCallInitiator = (initiatorRcUserId: string) =>
	initiatorRcUserId === getTokenFromCookie('rc_uid');

const currentUserIsAsker = (askerRcUserId: string) =>
	askerRcUserId === getTokenFromCookie('rc_uid');

export const currentUserIsTeamConsultant = (
	initiatorRcUserId: string,
	askerRcUserId: string
) =>
	!currentUserWasVideoCallInitiator(initiatorRcUserId) &&
	!currentUserIsAsker(askerRcUserId);

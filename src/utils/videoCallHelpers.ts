import { getValueFromCookie } from '../components/sessionCookie/accessSessionCookie';

export const getVideoCallUrl = (
	url: string,
	isVideoActivated: boolean = false
) => {
	return `${url}#config.startWithVideoMuted=${!isVideoActivated}`;
};

export const currentUserWasVideoCallInitiator = (initiatorRcUserId: string) =>
	initiatorRcUserId === getValueFromCookie('rc_uid');

const currentUserIsAsker = (askerRcUserId: string) =>
	askerRcUserId === getValueFromCookie('rc_uid');

export const currentUserIsTeamConsultant = (
	initiatorRcUserId: string,
	askerRcUserId: string
) =>
	!currentUserWasVideoCallInitiator(initiatorRcUserId) &&
	!currentUserIsAsker(askerRcUserId);

import { getTokenFromCookie } from '../../../components/sessionCookie/accessSessionCookie';

export type NotificationType = 'call';

export const getVideoCallUrl = (
	url: string,
	isVideoActivated: boolean = false
) => {
	return isVideoActivated ? url : `${url}#config.startWithVideoMuted=true`;
};

export const currentUserWasVideoCallInitiator = (initiatorRcUserId: string) =>
	initiatorRcUserId === getTokenFromCookie('rc_uid');

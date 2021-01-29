export type NotificationType = 'call';

export const getVideoCallUrl = (
	url: string,
	isVideoActivated: boolean = false
) => {
	return isVideoActivated
		? `${url}#config.startWithVideoMuted=false`
		: `${url}#config.startWithVideoMuted=true`;
};

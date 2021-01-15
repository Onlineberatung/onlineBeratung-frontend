export type CallType = 'video' | 'audio';

export const getCallUrl = (callType: CallType, url: string) => {
	return callType === 'video'
		? url
		: `${url}#config.startWithVideoMuted=true`;
};

export const getVideoCallUrl = (
	url: string,
	isVideoActivated: boolean = false
) => {
	return isVideoActivated ? url : `${url}#config.startWithVideoMuted=true`;
};

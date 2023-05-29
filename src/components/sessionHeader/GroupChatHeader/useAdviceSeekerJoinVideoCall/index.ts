import { useCallback, useContext, useEffect, useState } from 'react';
import { UserDataContext } from '../../../../globalState';
import { generatePath } from 'react-router-dom';
import { useAppConfig } from '../../../../hooks/useAppConfig';

export const useAdviceSeekerJoinVideoCall = () => {
	const { urls } = useAppConfig();
	const { userData } = useContext(UserDataContext);
	const [videoUrl, setVideoUrl] = useState('');

	const onStartVideoCall = useCallback(
		(link) => {
			const url = new URL(link);
			setVideoUrl(
				generatePath(urls.videoCall, {
					domain: url.host,
					jwt: url.searchParams.get('jwt'),
					e2e: userData.e2eEncryptionEnabled ? 1 : 0,
					video: 1,
					username: userData.displayName
						? userData.displayName
						: userData.userName
				})
			);
		},
		[
			urls.videoCall,
			userData.displayName,
			userData.e2eEncryptionEnabled,
			userData.userName
		]
	);

	useEffect(() => {
		if (!videoUrl) {
			return;
		}
		const videoCallWindow = window.open('', '_blank');
		videoCallWindow.location.href = videoUrl;
		videoCallWindow.focus();
	}, [videoUrl]);

	return {
		joinVideoCall: onStartVideoCall
	};
};

import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { apiStartVideoCall } from '../../../../api';
import { UserDataContext, ActiveSessionContext } from '../../../../globalState';
import { generatePath } from 'react-router-dom';
import { useAppConfig } from '../../../../hooks/useAppConfig';

export const useStartVideoCall = () => {
	const isLoadingRef = useRef(false);
	const { urls } = useAppConfig();
	const { activeSession } = useContext(ActiveSessionContext);
	const { userData } = useContext(UserDataContext);
	const [videoUrl, setVideoUrl] = useState('');

	const onStartVideoCall = useCallback(() => {
		if (isLoadingRef.current) {
			return;
		}
		isLoadingRef.current = true;
		apiStartVideoCall(
			undefined,
			userData.displayName ? userData.displayName : userData.userName,
			activeSession.item.id
		)
			.then((response) => {
				const url = new URL(response.moderatorVideoCallUrl);
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
				isLoadingRef.current = false;
			})
			.catch((error) => {
				console.log(error);
				isLoadingRef.current = false;
			});
	}, [
		activeSession.item.id,
		urls.videoCall,
		userData.displayName,
		userData.e2eEncryptionEnabled,
		userData.userName,
		isLoadingRef
	]);

	useEffect(() => {
		if (!videoUrl) {
			return;
		}
		const videoCallWindow = window.open('', '_blank');
		videoCallWindow.location.href = videoUrl;
		videoCallWindow.focus();
	}, [videoUrl]);

	return {
		url: videoUrl,
		startVideoCall: onStartVideoCall
	};
};

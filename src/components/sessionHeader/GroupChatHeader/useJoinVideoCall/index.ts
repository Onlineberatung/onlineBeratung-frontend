import { useCallback, useContext } from 'react';
import {
	AUTHORITIES,
	UserDataContext,
	hasUserAuthority
} from '../../../../globalState';
import { generatePath } from 'react-router-dom';
import { useAppConfig } from '../../../../hooks/useAppConfig';
import { apiJoinGroupChat } from '../../../../api';

const regexUUID =
	/(\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b)/;

export const useJoinVideoCall = () => {
	const { urls } = useAppConfig();
	const { userData } = useContext(UserDataContext);

	const isConsultant = hasUserAuthority(
		AUTHORITIES.CONSULTANT_DEFAULT,
		userData
	);

	const openVideoWindow = useCallback(
		(link: string, videoActivated: boolean) => {
			const url = new URL(link);
			const videoLink = generatePath(urls.videoCall, {
				domain: url.host,
				jwt: url.searchParams.get('jwt'),
				e2e: userData.e2eEncryptionEnabled ? 1 : 0,
				video: videoActivated ? 1 : 0,
				username: userData.displayName || userData.userName
			});
			const videoCallWindow = window.open('', '_blank');
			videoCallWindow.location.href = videoLink;
			videoCallWindow.focus();
		},
		[userData, urls.videoCall]
	);

	const onJoinConsultantCall = useCallback(
		(uuid, videoActivated: boolean) => {
			apiJoinGroupChat(uuid)
				.then((data) =>
					openVideoWindow(data.moderatorVideoCallUrl, videoActivated)
				)
				.catch((error) =>
					console.error(
						'Unable to join consultant to video chat [roomId]:',
						uuid,
						error
					)
				);
		},
		[openVideoWindow]
	);

	const joinVideoCall = useCallback(
		(link, videoActivated = true) => {
			const uuid = link.match(regexUUID)?.[0];
			isConsultant
				? onJoinConsultantCall(uuid, videoActivated)
				: openVideoWindow(link, videoActivated);
		},
		[isConsultant, onJoinConsultantCall, openVideoWindow]
	);

	return {
		joinVideoCall
	};
};

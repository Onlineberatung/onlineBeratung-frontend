import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useParams, generatePath } from 'react-router-dom';
import { JitsiMeeting } from '@jitsi/react-sdk';
import IJitsiMeetExternalApi from '@jitsi/react-sdk/lib/types/IJitsiMeetExternalApi';
import { Loading } from '../app/Loading';
import { config, uiUrl } from '../../resources/scripts/config';
import './videoCall.styles.scss';
import StatusPage from './StatusPage';

type TJistiJWTPayload = {
	moderator: boolean;
	room: string;
	guestVideoCallUrl: string;
};

const VideoCall = () => {
	const { domain, jwt, e2e, video, username } = useParams();

	const [externalApi, setExternalApi] = useState<IJitsiMeetExternalApi>(null);
	const [rejected, setRejected] = useState(false);
	const [closed, setClosed] = useState(false);
	const [ready, setReady] = useState(false);
	const [e2eEnabled, setE2EEnabled] = useState(false);
	const [videoCallJwtData, setVideoCallJwtData] =
		useState<TJistiJWTPayload>(null);
	const [shareableUrl, setShareableUrl] = useState<TJistiJWTPayload>(null);

	useEffect(() => {
		try {
			const jsonPayload = JSON.parse(
				decodeURIComponent(
					window
						.atob(
							jwt
								.split('.')[1]
								.replace(/-/g, '+')
								.replace(/_/g, '/')
						)
						.split('')
						.map(
							(c) =>
								'%' +
								('00' + c.charCodeAt(0).toString(16)).slice(-2)
						)
						.join('')
				)
			);
			setVideoCallJwtData(jsonPayload);

			if (jsonPayload.guestVideoCallUrl) {
				const url = new URL(jsonPayload.guestVideoCallUrl);
				setShareableUrl(
					generatePath(`${uiUrl}${config.urls.videoCall}`, {
						domain: url.host,
						jwt: url.searchParams.get('jwt')
					})
				);
			}

			setReady(true);
		} catch (e) {
			setRejected(true);
		}
	}, [e2e, jwt, video]);

	const handleJitsiError = useCallback((e) => {
		switch (e.error.name) {
			case 'connection.passwordRequired':
			case 'conference.connectionError.accessDenied':
				setRejected(true);
				break;
			case 'conference.destroyed':
				setClosed(true);
				break;
		}
	}, []);

	const handleClose = useCallback(() => {
		setClosed(true);
	}, []);

	const handleCustomE2EEToggled = useCallback((e) => {
		setE2EEnabled(e.enabled);
	}, []);

	useEffect(() => {
		if (externalApi) {
			// Set the externalApi to window object so we could emit from cypress
			(window as any).externalApi = externalApi;

			// @ts-ignore
			externalApi._transport.on('event', ({ name, ...data }) => {
				switch (name) {
					case 'custom-e2ee-toggled':
						externalApi.emit('custom-e2ee-toggled', data);
						break;
				}
			});

			if (videoCallJwtData?.moderator) {
				externalApi.on('readyToClose', handleClose);
			} else {
				externalApi.on('errorOccurred', handleJitsiError);
			}

			externalApi.on('custom-e2ee-toggled', handleCustomE2EEToggled);
		}

		return () => {
			if (externalApi) {
				if (videoCallJwtData?.moderator) {
					externalApi.executeCommand('toggleE2EE', false);
					externalApi.off('readyToClose', handleClose);
				} else {
					externalApi.off('errorOccurred', handleJitsiError);
				}

				externalApi.off('custom-e2ee-toggled', handleCustomE2EEToggled);
			}
		};
	}, [
		externalApi,
		handleClose,
		handleCustomE2EEToggled,
		handleJitsiError,
		videoCallJwtData
	]);

	if (rejected || closed) {
		return <StatusPage closed={closed} />;
	}

	if (!ready) {
		return <Loading />;
	}

	return (
		<div data-cy="jitsi-meeting">
			<div className="e2ee-banner">
				<div className="e2ee-banner__icon-filled">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						height="24px"
						viewBox="0 0 24 24"
						width="24px"
						fill="#000000"
					>
						<path d="M0 0h24v24H0V0z" fill="none" />
						<path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
					</svg>
				</div>
				<div className="e2ee-banner__icon-outline">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						height="24px"
						viewBox="0 0 24 24"
						width="24px"
						fill="#000000"
					>
						<path d="M0 0h24v24H0V0z" fill="none" />
						<path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm7 10c0 4.52-2.98 8.69-7 9.93-4.02-1.24-7-5.41-7-9.93V6.3l7-3.11 7 3.11V11zm-11.59.59L6 13l4 4 8-8-1.41-1.42L10 14.17z" />
					</svg>
				</div>

				<div className="text">
					{e2eEnabled
						? 'Dieser Video-Call ist mit der Ende-zu-Ende Verschlüsselung gesichert.'
						: 'Dieser Video-Call ist mit der Transportverschlüsselung gesichert.'}
				</div>
			</div>
			<JitsiMeeting
				domain={domain}
				jwt={jwt}
				roomName={videoCallJwtData.room}
				getIFrameRef={(node) => (node.style.height = '100vh')}
				onApiReady={(e) => {
					setExternalApi(e);
				}}
				configOverwrite={{
					startWithVideoMuted: !parseInt(video)
				}}
				interfaceConfigOverwrite={{
					SHOW_PROMOTIONAL_CLOSE_PAGE: false,
					shareableUrl,
					e2eEncryptionEnabled: !!parseInt(e2e)
				}}
				{...(username
					? {
							userInfo: {
								displayName: username,
								email: ''
							}
					  }
					: {})}
			/>
		</div>
	);
};

export default VideoCall;

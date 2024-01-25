import * as React from 'react';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useParams, generatePath } from 'react-router-dom';
import { JitsiMeeting } from '@jitsi/react-sdk';
import IJitsiMeetExternalApi from '@jitsi/react-sdk/lib/types/IJitsiMeetExternalApi';
import { Loading } from '../app/Loading';
import { uiUrl } from '../../resources/scripts/config';
import StatusPage from './StatusPage';
import { LocaleContext } from '../../globalState';
import Logo from '../videoConference/Logo';
import E2EEBanner from '../videoConference/E2EEBanner';
import { useAppConfig } from '../../hooks/useAppConfig';
import { useTranslation } from 'react-i18next';

type TJistiJWTPayload = {
	moderator: boolean;
	room: string;
	guestVideoCallUrl: string;
};

const VideoCall = () => {
	const settings = useAppConfig();
	const { domain, jwt, e2e, video, username } = useParams<{
		domain: string;
		jwt: string;
		e2e: string;
		video: string;
		username: string;
	}>();

	const [externalApi, setExternalApi] = useState<IJitsiMeetExternalApi>(null);
	const [rejected, setRejected] = useState(false);
	const [closed, setClosed] = useState(false);
	const [ready, setReady] = useState(false);
	const [e2eEnabled, setE2EEnabled] = useState(false);
	const [videoCallJwtData, setVideoCallJwtData] =
		useState<TJistiJWTPayload>(null);
	const [shareableUrl, setShareableUrl] = useState<string>(null);
	const { locale } = useContext(LocaleContext);
	const { t: translate } = useTranslation();

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
					`${uiUrl}${generatePath(settings.urls.videoCall, {
						domain: url.host,
						jwt: url.searchParams.get('jwt')
					})}`
				);
			}

			setReady(true);
		} catch (e) {
			setRejected(true);
		}
	}, [e2e, jwt, video, settings.urls.videoCall]);

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
			{settings.jitsi.showE2EEBanner && (
				<E2EEBanner e2eEnabled={e2eEnabled} />
			)}
			{settings.jitsi.showLogo && <Logo />}
			<JitsiMeeting
				domain={domain}
				jwt={jwt}
				roomName={videoCallJwtData.room}
				getIFrameRef={(node) => (node.style.height = '100vh')}
				onApiReady={(e) => {
					setExternalApi(e);
				}}
				configOverwrite={{
					startWithVideoMuted: !parseInt(video),
					defaultLanguage: locale
				}}
				interfaceConfigOverwrite={{
					SHOW_PROMOTIONAL_CLOSE_PAGE: false,
					shareableUrl,
					btnText: encodeURI(translate('jitsi.btn.default')),
					btnTextCopied: encodeURI(translate('jitsi.btn.copied')),
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

import * as React from 'react';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useParams, generatePath } from 'react-router-dom';
import { JitsiMeeting } from '@jitsi/react-sdk';
import IJitsiMeetExternalApi from '@jitsi/react-sdk/lib/types/IJitsiMeetExternalApi';
import {
	AUTHORITIES,
	hasUserAuthority,
	LegalLinkInterface,
	UserDataContext
} from '../../globalState';
import * as appointmentService from '../../api/appointments';
import * as videocallsService from '../../api/videocalls';
import {
	AppointmentsDataInterface,
	STATUS_PAUSED,
	STATUS_STARTED
} from '../../globalState/interfaces/AppointmentsDataInterface';
import { VideoCallJwtDataInterface } from '../../globalState/interfaces/VideoCallDataInterface';
import { Loading } from '../app/Loading';
import { WaitingRoom } from './WaitingRoom';
import { useWatcher } from '../../hooks/useWatcher';
import { useUnload } from '../../hooks/useUnload';
import { config, uiUrl } from '../../resources/scripts/config';

const VideoConference = ({
	legalLinks
}: {
	legalLinks: Array<LegalLinkInterface>;
}) => {
	const { status, appointmentId } = useParams();

	const [externalApi, setExternalApi] = useState<IJitsiMeetExternalApi>(null);
	const [initialized, setInitialized] = useState(false);
	const [ready, setReady] = useState(false);
	const [rejected, setRejected] = useState(false);
	const [confirmed, setConfirmed] = useState(status === 'confirmed');
	const [appointment, setAppointment] =
		useState<AppointmentsDataInterface>(null);
	const [videoCallJwtData, setVideoCallJwtData] =
		useState<VideoCallJwtDataInterface>(null);

	const { userData } = useContext(UserDataContext);

	const isModerator = useCallback(
		() =>
			userData &&
			hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData),
		[userData]
	);

	const loadAppointment = useCallback(() => {
		return appointmentService.getAppointment(appointmentId).then((res) => {
			if (res.status !== appointment?.status) {
				setAppointment(res);
			}
		});
	}, [appointment?.status, appointmentId]);

	const [startWatcher, stopWatcher, isWatcherRunning] =
		useWatcher(loadAppointment);

	const startAppointment = useCallback(() => {
		if (isModerator() && appointment.status !== STATUS_STARTED) {
			appointmentService
				.putAppointment(appointmentId, {
					...appointment,
					status: STATUS_STARTED
				})
				.then();
		}
	}, [appointment, appointmentId, isModerator]);

	const pauseAppointment = useCallback(() => {
		if (isModerator()) {
			appointmentService
				.putAppointment(appointmentId, {
					...appointment,
					status: STATUS_PAUSED
				})
				.then();
		}
	}, [appointment, appointmentId, isModerator]);

	const handleJitsiError = useCallback((e) => {
		if (e.error.name === 'conference.connectionError.accessDenied') {
			setRejected(true);
		}
	}, []);

	useUnload(pauseAppointment, true);

	useEffect(() => {
		// Always confirm for consultants
		if (!confirmed && isModerator()) {
			setConfirmed(true);
		}
	}, [confirmed, isModerator]);

	useEffect(() => {
		if (!initialized) {
			setInitialized(true);

			Promise.all([
				appointmentService.getAppointment(appointmentId),
				videocallsService.getJwt(appointmentId)
			])
				.then(([appointment, videoCallJwtData]) => {
					setAppointment(appointment);
					setVideoCallJwtData(videoCallJwtData);
				})
				.catch((e) => console.error(e))
				.finally(() => setReady(true));
		}
	}, [appointmentId, initialized]);

	useEffect(() => {
		if (appointment?.id && !isModerator() && !isWatcherRunning) {
			startWatcher();
		}

		return () => {
			if (isWatcherRunning) {
				stopWatcher();
			}
		};
	}, [appointment, isModerator, isWatcherRunning, startWatcher, stopWatcher]);

	useEffect(() => {
		if (externalApi) {
			// Set the externalApi to window object so we could emit from cypress
			(window as any).externalApi = externalApi;

			if (isModerator()) {
				// Set appointment started after jitsi has finished initialization and meeting is ready
				externalApi.on('videoConferenceJoined', startAppointment);
				externalApi.on('readyToClose', pauseAppointment);
			} else {
				externalApi.on('errorOccurred', handleJitsiError);
			}
		}
		return () => {
			if (externalApi) {
				if (isModerator()) {
					externalApi.off('videoConferenceJoined', startAppointment);
					externalApi.off('readyToClose', pauseAppointment);
				} else {
					externalApi.off('errorOccurred', handleJitsiError);
				}
			}
		};
	}, [
		appointment,
		externalApi,
		isModerator,
		appointmentId,
		startAppointment,
		pauseAppointment,
		handleJitsiError
	]);

	const getError = useCallback(() => {
		if (!appointment) {
			return {
				error: {
					title: 'videoConference.waitingroom.errorPage.headline',
					description: isModerator()
						? 'videoConference.waitingroom.errorPage.consultant.description'
						: 'videoConference.waitingroom.errorPage.description'
				}
			};
		} else if (rejected) {
			return {
				error: {
					title: 'videoConference.waitingroom.errorPage.rejected.headline',
					description:
						'videoConference.waitingroom.errorPage.rejected.description'
				}
			};
		}

		return {};
	}, [appointment, isModerator, rejected]);

	if (!ready) {
		return <Loading />;
	}

	if (
		!appointment ||
		!confirmed ||
		rejected ||
		(!isModerator() && appointment?.status !== STATUS_STARTED)
	) {
		// Appointment not exists
		// DataProtection not confirmed
		// Waiting for appointment to get started
		return (
			<div className="videoConference">
				<WaitingRoom
					otherClass={'videoConferenceWaitingRoom'}
					confirmed={confirmed}
					setConfirmed={setConfirmed}
					status={appointment?.status}
					legalLinks={legalLinks}
					{...getError()}
				/>
			</div>
		);
	}

	return (
		<div data-cy="jitsi-meeting">
			<JitsiMeeting
				domain={videoCallJwtData.domain.replace('https://', '')}
				jwt={videoCallJwtData.jwt}
				roomName={appointment.id}
				getIFrameRef={(node) => (node.style.height = '100vh')}
				onApiReady={setExternalApi}
				interfaceConfigOverwrite={{
					SHOW_PROMOTIONAL_CLOSE_PAGE: false,
					shareableUrl: `${uiUrl}${generatePath(
						config.urls.videoConference,
						{
							type: 'app',
							appointmentId: appointment.id
						}
					)}`
				}}
			/>
		</div>
	);
};

export default VideoConference;

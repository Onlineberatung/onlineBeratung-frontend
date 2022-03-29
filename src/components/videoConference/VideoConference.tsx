import * as React from 'react';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { JitsiMeeting } from '@jitsi/react-sdk';
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

/*
ToDo: This logic is just temporary. It should be finalised in with the next upcoming tickets.
 */
const VideoConference = ({
	legalLinks
}: {
	legalLinks: Array<LegalLinkInterface>;
}) => {
	const { status, appointmentId } = useParams();

	const [externalApi, setExternalApi] = useState(null);
	const [initialized, setInitialized] = useState(false);
	const [ready, setReady] = useState(false);
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
			// Set appointment started after jitsi has finished initialization and meeting is ready
			if (isModerator() && appointment.status !== STATUS_STARTED) {
				appointmentService
					.putAppointment(appointmentId, {
						...appointment,
						status: STATUS_STARTED
					})
					.then();
			}
		}
	}, [appointment, externalApi, isModerator, appointmentId]);

	if (!ready) {
		return <Loading />;
	}

	if (!appointment) {
		// Has been ended or paused
		return (
			<WaitingRoom
				confirmed={true}
				setConfirmed={setConfirmed}
				status={appointment.status}
				legalLinks={legalLinks}
			/>
		);
	}

	if (!confirmed) {
		// DataProtection not confirmed
		return (
			<WaitingRoom
				confirmed={confirmed}
				setConfirmed={setConfirmed}
				status={appointment.status}
				legalLinks={legalLinks}
			/>
		);
	}

	if (!isModerator() && appointment.status !== STATUS_STARTED) {
		// Waiting for appointment to get started
		return (
			<Waiting
				appointmentId={appointmentId}
				setAppointment={setAppointment}
				status={appointment.status}
				legalLinks={legalLinks}
			/>
		);
	}

	return (
		<div>
			<JitsiMeeting
				//domain={videoCallJwtData.domain.replace('https://', '')}
				domain="onlineberatung.local:8443"
				jwt={videoCallJwtData.jwt}
				roomName={appointment.id}
				getIFrameRef={(node) => (node.style.height = '100vh')}
				onApiReady={setExternalApi}
			/>
		</div>
	);
};

const Waiting = ({ appointmentId, setAppointment, legalLinks, status }) => {
	return (
		<WaitingRoom
			confirmed={true}
			setConfirmed={() => {}}
			legalLinks={legalLinks}
			status={status}
		/>
	);
};

export default VideoConference;

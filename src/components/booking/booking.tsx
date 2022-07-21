import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { config } from '../../resources/scripts/config';
import {
	setBookingWrapperActive,
	setBookingWrapperInactive
} from '../app/navigationHandler';
import Cal from '../cal/Cal';
import {
	SessionsDataContext,
	SET_SESSIONS,
	UserDataContext,
	UserDataInterface
} from '../../globalState';
import {
	apiGetAskerSessionList,
	getCounselorAppointmentLink,
	getTeamAppointmentLink
} from '../../api';

export const getUserEmail = (userData: UserDataInterface) => {
	return userData.email
		? userData.email
		: userData.userName + '@suchtberatung.digital';
};

export const Booking = () => {
	const { userData } = useContext(UserDataContext);
	const { dispatch } = useContext(SessionsDataContext);
	const [appointmentLink, setAppointmentLink] = useState<string | null>(null);

	useEffect(() => {
		setBookingWrapperActive();

		return () => {
			setBookingWrapperInactive();
		};
	}, []);

	useEffect(() => {
		apiGetAskerSessionList().then((response) => {
			dispatch({
				type: SET_SESSIONS,
				ready: true,
				sessions: response.sessions
			});

			const consultant = response.sessions[0]?.consultant;
			const agencyId = response.sessions[0]?.agency?.id;
			if (consultant) {
				getCounselorAppointmentLink(consultant?.consultantId).then(
					(response) => {
						setAppointmentLink(response.slug);
					}
				);
			} else if (agencyId) {
				getTeamAppointmentLink(agencyId).then((response) => {
					setAppointmentLink(`team/${response.slug}`);
				});
			}
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<React.Fragment>
			{appointmentLink && (
				<Cal
					calLink={appointmentLink}
					calOrigin={config.urls.appointmentServiceDevServer}
					config={{
						'name': userData.userName,
						'email': getUserEmail(userData),
						'theme': 'light',
						'metadata[user]': userData.userId
					}}
				/>
			)}
		</React.Fragment>
	);
};

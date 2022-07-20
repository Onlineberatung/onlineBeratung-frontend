import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { config } from '../../resources/scripts/config';
import {
	setBookingWrapperActive,
	setBookingWrapperInactive
} from '../app/navigationHandler';
import Cal from '../cal/Cal';
import { UserDataContext, UserDataInterface } from '../../globalState';
import { useLocation } from 'react-router-dom';
import { getCounselorAppointmentLink, getTeamAppointmentLink } from '../../api';

export const getUserEmail = (userData: UserDataInterface) => {
	return userData.email
		? userData.email
		: userData.userName + '@suchtberatung.digital';
};

export const Booking = () => {
	const { userData } = useContext(UserDataContext);
	const [appointmentLink, setAppointmentLink] = useState<string | null>(null);
	const location = useLocation();

	useEffect(() => {
		setBookingWrapperActive();

		return () => {
			setBookingWrapperInactive();
		};
	}, []);
	const assignedConsultant = location.state.session.consultant;

	const setCounselorLink = () => {
		// getCounselorAppointmentLink(assignedConsultant.consultantId).then(
		getCounselorAppointmentLink(
			'a9227405-69c6-4184-9b5c-beeea5d3354a'
		).then((response) => {
			setAppointmentLink(response.slug);
		});
	};

	const setTeamLink = () => {
		// const agencyId = assignedConsultant.state.consultant.agency.id;
		const agencyId = 2;
		getTeamAppointmentLink(agencyId).then((response) => {
			setAppointmentLink(`team/${response.slug}`);
		});
	};

	useEffect(() => {
		assignedConsultant ? setCounselorLink() : setTeamLink();
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

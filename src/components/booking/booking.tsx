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
	UserDataContext,
	UserDataInterface
} from '../../globalState';
import { getCounselorAppointmentLink, getTeamAppointmentLink } from '../../api';

export const getUserEmail = (userData: UserDataInterface) => {
	return userData.email
		? userData.email
		: userData.userName + '@suchtberatung.digital';
};

export const Booking = () => {
	const { userData } = useContext(UserDataContext);
	const { sessions } = useContext(SessionsDataContext);
	const [appointmentLink, setAppointmentLink] = useState<string | null>(null);

	useEffect(() => {
		setBookingWrapperActive();

		return () => {
			setBookingWrapperInactive();
		};
	}, []);

	const assignedConsultant = sessions?.mySessions?.[0].consultant;

	const setCounselorLink = () => {
		getCounselorAppointmentLink(assignedConsultant.consultantId).then(
			(response) => {
				setAppointmentLink(response.slug);
			}
		);
	};

	const setTeamLink = () => {
		const agencyId = sessions?.mySessions?.[0]?.agency?.id;
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

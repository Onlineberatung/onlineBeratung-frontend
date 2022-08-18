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

	useEffect(() => {
		const consultant = sessions[0]?.consultant;
		const agencyId = sessions[0]?.agency?.id;
		if (consultant) {
			const consultantId = consultant?.consultantId || consultant?.id;
			getCounselorAppointmentLink(consultantId).then((response) => {
				setAppointmentLink(response.slug);
			});
		} else {
			getTeamAppointmentLink(agencyId).then((response) => {
				setAppointmentLink(`team/${response.slug}`);
			});
		}
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

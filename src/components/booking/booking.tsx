import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import {
	setBookingWrapperActive,
	setBookingWrapperInactive
} from '../app/navigationHandler';
import Cal from '../cal/Cal';
import {
	AUTHORITIES,
	hasUserAuthority,
	UserDataContext,
	UserDataInterface
} from '../../globalState';
import {
	apiGetAskerSessionList,
	getCounselorAppointmentLink,
	getTeamAppointmentLink
} from '../../api';
import { useAppConfig } from '../../hooks/useAppConfig';

export const getUserEmail = (userData: UserDataInterface) => {
	return userData.email
		? userData.email
		: userData.userName + '@suchtberatung.digital';
};

export const Booking = () => {
	const { userData } = useContext(UserDataContext);
	const [appointmentLink, setAppointmentLink] = useState<string | null>(null);
	const settings = useAppConfig();

	useEffect(() => {
		setBookingWrapperActive();

		return () => {
			setBookingWrapperInactive();
		};
	}, []);

	useEffect(() => {
		const isConsultant = hasUserAuthority(
			AUTHORITIES.CONSULTANT_DEFAULT,
			userData
		);

		if (!isConsultant) {
			apiGetAskerSessionList().then(({ sessions }) => {
				const consultant = sessions[0]?.consultant;
				const agencyId = sessions[0]?.agency?.id;
				if (consultant) {
					const consultantId =
						consultant?.consultantId || consultant?.id;
					getCounselorAppointmentLink(consultantId).then(
						(response) => {
							setAppointmentLink(response.slug);
						}
					);
				} else {
					getTeamAppointmentLink(agencyId).then((response) => {
						setAppointmentLink(`team/${response.slug}`);
					});
				}
			});
		}
	}, [userData]);

	return (
		<React.Fragment>
			{appointmentLink && settings.calcomUrl && (
				<Cal
					calLink={appointmentLink}
					calOrigin={settings.calcomUrl}
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

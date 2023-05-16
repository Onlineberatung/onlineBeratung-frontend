import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import {
	ListItemInterface,
	UserDataContext,
	UserDataInterface
} from '../../../../globalState';
import {
	apiGetAskerSessionList,
	getCounselorAppointmentLink,
	getTeamAppointmentLink
} from '../../../../api';
import Cal from '../Calcom/Cal';
import { useAppConfig } from '../../../../hooks/useAppConfig';
import {
	setBookingWrapperActive,
	setBookingWrapperInactive
} from '../../../../components/app/navigationHandler';
import { getValueFromCookie } from '../../../../components/sessionCookie/accessSessionCookie';

export const getUserEmail = (userData: UserDataInterface) => {
	return userData.email
		? userData.email
		: userData.userName + '@suchtberatung.digital';
};

export const Booking = () => {
	const { userData } = useContext(UserDataContext);
	const [session, setSession] = useState<ListItemInterface>();
	const [appointmentLink, setAppointmentLink] = useState<string | null>(null);
	const settings = useAppConfig();

	useEffect(() => {
		setBookingWrapperActive();

		return () => {
			setBookingWrapperInactive();
		};
	}, []);

	useEffect(() => {
		apiGetAskerSessionList().then(({ sessions }) => {
			setSession(sessions[0]);
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
		});
	}, [userData]);

	return (
		<React.Fragment>
			{appointmentLink && settings.calcomUrl && userData.userId && (
				<Cal
					calLink={appointmentLink}
					calOrigin={settings.calcomUrl}
					config={{
						'name': userData.userName,
						'email': getUserEmail(userData),
						'theme': 'light',
						'metadata[user]': userData.userId,
						'metadata[isInitialAppointment]':
							!session.consultant ||
							new Date(session.latestMessage).getTime() <
								new Date(session.session.createDate).getTime(),
						'metadata[sessionId]': session.session.id,
						'metadata[rcToken]': getValueFromCookie('rc_token'),
						'metadata[rcUserId]': getValueFromCookie('rc_uid'),
						'metadata[userToken]': getValueFromCookie('keycloak')
					}}
					embedJsUrl={`${settings.calcomUrl}/embed/embed.js`}
				/>
			)}
		</React.Fragment>
	);
};

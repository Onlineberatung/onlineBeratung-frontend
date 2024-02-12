import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { UserDataContext } from '../../../../globalState';
import {
	ListItemInterface,
	STATUS_EMPTY,
	UserDataInterface
} from '../../../../globalState/interfaces';
import {
	apiGetAskerSessionList,
	getCounselorAppointmentLink,
	getTeamAppointmentLink
} from '../../../../api';
import Cal from '../Calcom/Cal';
import { useAppConfig } from '../../../../hooks/useAppConfig';
import { getValueFromCookie } from '../../../../components/sessionCookie/accessSessionCookie';

export const getUserEmail = (userData: UserDataInterface) => {
	return userData.email
		? userData.email
		: userData.userName?.replace(/ /g, '') + '@suchtberatung.digital';
};

export const Booking = () => {
	const { userData } = useContext(UserDataContext);
	const [session, setSession] = useState<ListItemInterface>();
	const [appointmentLink, setAppointmentLink] = useState<string | null>(null);
	const settings = useAppConfig();

	useEffect(() => {
		apiGetAskerSessionList().then(({ sessions }) => {
			const session = sessions.find((s) => !!s.agency);
			setSession(session);
			const consultant = session?.consultant;
			const agencyId = session?.agency?.id;
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

	if (!session) return null;

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
						'metadata[user]': userData.userId,
						'metadata[isInitialAppointment]':
							!session.consultant ||
							session.session.status === STATUS_EMPTY,
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

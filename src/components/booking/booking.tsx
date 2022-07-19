import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { config } from '../../resources/scripts/config';
import {
	setBookingWrapperActive,
	setBookingWrapperInactive
} from '../app/navigationHandler';
import Cal from '../cal/Cal';
import { SessionsDataContext, UserDataContext } from '../../globalState';
import {
	apiAppointmentServiceTeamById,
	apiAppointmentServiceEventTypes
} from '../../api';
import { getuserEmail } from '../../utils/getUserEmail';

export const Booking = () => {
	useEffect(() => {
		setBookingWrapperActive();

		return () => {
			setBookingWrapperInactive();
		};
	}, []);

	const { userData } = useContext(UserDataContext);
	const { sessionsData } = useContext(SessionsDataContext);
	const [team, setTeam] = useState<string | null>(null);

	useEffect(() => {
		if (sessionsData?.mySessions?.[0]?.consultant) {
			apiAppointmentServiceEventTypes(
				sessionsData?.mySessions?.[0]?.consultant.consultantId
			).then((resp) => {
				setTeam(resp.slug);
			});
		} else {
			const agencyId = sessionsData?.mySessions?.[0]?.agency?.id;
			apiAppointmentServiceTeamById(agencyId).then((resp) => {
				setTeam(`team/${resp.slug}`);
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [team]);

	return (
		<React.Fragment>
			{team && (
				<Cal
					calLink={team}
					calOrigin={config.urls.appointmentServiceDevServer}
					config={{
						'name': userData.userName,
						'email': getuserEmail(userData),
						'theme': 'light',
						'metadata[user]': userData.userId
					}}
				/>
			)}
		</React.Fragment>
	);
};

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
			apiAppointmentServiceEventTypes(userData.userId).then((resp) => {
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
						name: userData.userName,
						email: userData.userName + '@email.com',
						theme: 'light'
					}}
				/>
			)}
		</React.Fragment>
	);
};

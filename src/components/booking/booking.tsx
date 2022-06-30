import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { config } from '../../resources/scripts/config';
import {
	setBookingWrapperActive,
	setBookingWrapperInactive
} from '../app/navigationHandler';
import Cal from '../cal/Cal';
import { SessionsDataContext, UserDataContext } from '../../globalState';
import { apiGetCalComTeamById } from '../../api';

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
		const agencyId = sessionsData?.mySessions?.[0]?.agency?.id;
		apiGetCalComTeamById(agencyId).then((resp) => {
			const team = resp.meetlingLink
				.split('https://calcom-develop.suchtberatung.digital/')
				.pop();
			setTeam(team);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [team]);

	return (
		<React.Fragment>
			{team && (
				<Cal
					calLink={team}
					calOrigin={config.urls.calComDevServer}
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

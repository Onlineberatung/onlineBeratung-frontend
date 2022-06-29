import * as React from 'react';
import { useContext, useEffect } from 'react';
import { config } from '../../resources/scripts/config';
import {
	setBookingWrapperActive,
	setBookingWrapperInactive
} from '../app/navigationHandler';
import Cal from '../cal/Cal';
import { UserDataContext } from '../../globalState';

export const Booking = () => {
	useEffect(() => {
		setBookingWrapperActive();

		return () => {
			setBookingWrapperInactive();
		};
	}, []);

	const { userData } = useContext(UserDataContext);

	return (
		<Cal
			calLink="team/team-hamburg"
			calOrigin={config.urls.calComDevServer}
			config={{
				name: userData.userName,
				email: userData.userName + '@email.com',
				theme: 'light'
			}}
		/>
	);
};

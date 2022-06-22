import * as React from 'react';
import { useEffect } from 'react';
import { config } from '../../resources/scripts/config';
import {
	setBookingWrapperActive,
	setBookingWrapperInactive
} from '../app/navigationHandler';
import Cal from '../cal/Cal';

export const Booking = () => {
	useEffect(() => {
		setBookingWrapperActive();

		return () => {
			setBookingWrapperInactive();
		};
	}, []);

	return (
		<Cal
			calLink="andre-soares"
			calOrigin={config.urls.calComDevServer}
			config={{
				name: 'John Doe',
				email: 'andre.soares@virtual-identity.com',
				theme: 'light'
			}}
		/>
	);
};

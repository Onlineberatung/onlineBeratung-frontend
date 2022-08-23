import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import {
	setBookingWrapperActive,
	setBookingWrapperInactive
} from '../../app/navigationHandler';
import { UserDataContext } from '../../../globalState';
import calcomLogin from './calcomLogin';
import { AvailabilityContainer } from './availabilityContainer';
import { CalendarIntegration } from './calendarIntegration';
import './bookingSettings.styles';

export const BookingSettings = () => {
	const { userData } = useContext(UserDataContext);
	const [loadExternalComponents, setLoadExternalComponents] = useState(false);

	useEffect(() => {
		setBookingWrapperActive();
		calcomLogin(userData).then(() => {
			setLoadExternalComponents(true);
		});

		return () => {
			setBookingWrapperInactive();
		};
	}, []);

	if (!loadExternalComponents) {
		return null;
	}

	return (
		<div className="settings-container">
			<AvailabilityContainer />
			<CalendarIntegration />
		</div>
	);
};

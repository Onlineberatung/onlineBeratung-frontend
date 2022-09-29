import * as React from 'react';
import { useEffect } from 'react';
import {
	setBookingWrapperActive,
	setBookingWrapperInactive
} from '../../../components/app/navigationHandler';
import { useCalcomLogin } from './calcomLogin';
import { AvailabilityContainer } from './availabilityContainer';
import { CalendarIntegration } from './calendarIntegration';
import './bookingSettings.styles';

export const BookingSettings = () => {
	const loadedExternalComponents = useCalcomLogin();

	useEffect(() => {
		setBookingWrapperActive();

		return () => {
			setBookingWrapperInactive();
		};
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	if (!loadedExternalComponents) {
		return null;
	}

	return (
		<div className="settings-container">
			<AvailabilityContainer />
			<CalendarIntegration />
		</div>
	);
};

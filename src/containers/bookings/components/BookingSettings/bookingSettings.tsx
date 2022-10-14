import * as React from 'react';
import { useEffect } from 'react';
import {
	setBookingWrapperActive,
	setBookingWrapperInactive
} from '../../../../components/app/navigationHandler';
import { useCalcomLogin } from '../../hooks/useCalcomLogin';
import { AvailabilityContainer } from '../AvailabilityContainer/availabilityContainer';
import { CalendarIntegration } from '../CalendarIntegration/calendarIntegration';
import '../booking.styles';

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

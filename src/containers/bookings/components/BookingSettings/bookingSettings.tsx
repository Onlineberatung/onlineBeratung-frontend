import * as React from 'react';
import { useCalcomLogin } from '../../hooks/useCalcomLogin';
import { AvailabilityContainer } from '../AvailabilityContainer/availabilityContainer';
import { CalendarIntegration } from '../CalendarIntegration/calendarIntegration';
import '../booking.styles';

export const BookingSettings = () => {
	const loadedExternalComponents = useCalcomLogin();

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

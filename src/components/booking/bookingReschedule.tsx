import * as React from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { config } from '../../resources/scripts/config';
import {
	setBookingWrapperActive,
	setBookingWrapperInactive
} from '../app/navigationHandler';

export const BookingReschedule = () => {
	useEffect(() => {
		setBookingWrapperActive();

		return () => {
			setBookingWrapperInactive();
		};
	}, []);

	const location = useLocation();

	return (
		// TODO: replace the slug for a dynamic one, something like: {`${config.urls.appointmentServiceDevServer}/${location.state.slug}?rescheduleUid=${location.state.uid}`}
		<iframe
			src={`${config.urls.appointmentServiceDevServer}/team/team-b/team-b-event?rescheduleUid=${location.state.uid}`}
			frameBorder={0}
			scrolling="false"
			width="100%"
			height="100%"
			title="booking-reschedule"
		/>
	);
};

import * as React from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { config } from '../../resources/scripts/config';
import {
	setBookingWrapperActive,
	setBookingWrapperInactive
} from '../app/navigationHandler';

export const BookingCancellation = () => {
	useEffect(() => {
		setBookingWrapperActive();

		return () => {
			setBookingWrapperInactive();
		};
	}, []);

	const location = useLocation();

	return (
		<iframe
			src={`${config.urls.appointmentServiceDevServer}/cancel/${location.state.uid}`}
			frameBorder={0}
			scrolling="false"
			width="100%"
			height="100%"
			title="booking-cancellation"
		/>
	);
};

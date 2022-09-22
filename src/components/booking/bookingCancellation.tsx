import * as React from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppConfig } from '../../hooks/useAppConfig';
import {
	setBookingWrapperActive,
	setBookingWrapperInactive
} from '../app/navigationHandler';

export const BookingCancellation = () => {
	const settings = useAppConfig();

	useEffect(() => {
		setBookingWrapperActive();

		return () => {
			setBookingWrapperInactive();
		};
	}, []);

	const location = useLocation();

	return (
		(settings.calcomUrl && (
			<iframe
				src={`${settings.calcomUrl}/cancel/${location.state.uid}`}
				frameBorder={0}
				scrolling="false"
				width="100%"
				height="100%"
				title="booking-cancellation"
			/>
		)) ||
		null
	);
};

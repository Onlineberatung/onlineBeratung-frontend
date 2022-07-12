import * as React from 'react';
import { useEffect } from 'react';
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

	return (
		<iframe
			src={`${config.urls.appointmentServiceDevServer}/team/team-b/team-b-event?rescheduleUid=wX1FRw3E7SaFeQ8yFSDGQC`}
			frameBorder={0}
			scrolling="false"
			width="100%"
			height="100%"
			title="booking-reschedule"
		/>
	);
};

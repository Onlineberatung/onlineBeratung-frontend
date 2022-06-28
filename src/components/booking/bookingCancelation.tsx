import * as React from 'react';
import { useEffect } from 'react';
import {
	setBookingWrapperActive,
	setBookingWrapperInactive
} from '../app/navigationHandler';

export const BookingCancelation = () => {
	useEffect(() => {
		setBookingWrapperActive();

		return () => {
			setBookingWrapperInactive();
		};
	}, []);

	return (
		<iframe
			src="https://calcom-develop.suchtberatung.digital/cancel/wX1FRw3E7SaFeQ8yFSDGQC"
			frameBorder={0}
			scrolling="false"
			width="100%"
			height="100%"
			title="booking-cancelation"
		/>
	);
};

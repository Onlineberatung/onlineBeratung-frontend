import * as React from 'react';
import { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { config } from '../../resources/scripts/config';
import {
	setBookingWrapperActive,
	setBookingWrapperInactive
} from '../app/navigationHandler';
import { UserDataContext } from '../../globalState';

export const BookingCancelation = () => {
	const { userData } = useContext(UserDataContext);

	useEffect(() => {
		setBookingWrapperActive();

		return () => {
			setBookingWrapperInactive();
		};
	}, []);

	const location = useLocation();

	return (
		<iframe
			src={`${config.urls.appointmentServiceDevServer}/cancel/${location.state.uid}?metadata[user]=${userData.userId}`}
			frameBorder={0}
			scrolling="false"
			width="100%"
			height="100%"
			title="booking-cancelation"
		/>
	);
};

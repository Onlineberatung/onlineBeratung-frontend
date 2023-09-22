import * as React from 'react';
import { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import {
	AUTHORITIES,
	hasUserAuthority,
	UserDataContext
} from '../../../../globalState';
import { useAppConfig } from '../../../../hooks/useAppConfig';

export const BookingReschedule = () => {
	const { userData } = useContext(UserDataContext);
	const isConsultant = hasUserAuthority(
		AUTHORITIES.CONSULTANT_DEFAULT,
		userData
	);
	const settings = useAppConfig();

	const location = useLocation<{
		askerId: string;
		rescheduleLink: string;
		bookingId: number;
	}>();

	const userId = isConsultant ? location.state.askerId : userData.userId;

	return (
		(settings.calcomUrl && (
			<iframe
				src={`${settings.calcomUrl}${location.state.rescheduleLink}&metadata[bookingId]=${location.state.bookingId}&metadata[user]=${userId}`}
				frameBorder={0}
				scrolling="false"
				width="100%"
				height="100%"
				title="booking-reschedule"
			/>
		)) ||
		null
	);
};

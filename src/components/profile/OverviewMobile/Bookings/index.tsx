import React from 'react';
import { BookingEvent } from '../../../../containers/overview/components/BookingEvent';
import {
	EmptyState,
	EmptyType
} from '../../../../containers/overview/components/EmptyState';
import { useConsultantBookings } from '../../../../containers/overview/hooks/useConsultantBookings';

export const OverviewBookings = () => {
	const { bookings } = useConsultantBookings();

	if (bookings.length === 0) {
		return (
			<EmptyState
				type={EmptyType.Termine}
				className="overviewEmptyState__profilePage"
			/>
		);
	}
	return (
		<div className="bookings">
			{bookings.map((booking) => {
				return <BookingEvent booking={booking} key={booking.id} />;
			})}
		</div>
	);
};

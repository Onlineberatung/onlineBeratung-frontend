import React from 'react';
import { useConsultantBookings } from '../../hooks/useConsultantBookings';
import { BookingEvent } from '../BookingEvent';
import { EmptyType } from '../EmptyState';
import { OverviewCard } from '../OverviewCard/OverviewCard';

export const BookingCard = () => {
	const { bookings, isLoading } = useConsultantBookings();

	return (
		<OverviewCard
			allMessagesPaths="/booking/events/gebuchte"
			className="bookingCard"
			title="overview.upcomingAppointments"
			dataListLength={bookings?.length}
			emptyType={EmptyType.Termine}
			isLoading={isLoading}
		>
			{!isLoading &&
				bookings
					?.slice(0, 9)
					?.map((booking) => (
						<BookingEvent key={booking.id} booking={booking} />
					))}
		</OverviewCard>
	);
};

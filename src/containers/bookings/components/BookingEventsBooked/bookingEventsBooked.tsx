import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import '../booking.styles';
import {
	AUTHORITIES,
	hasUserAuthority,
	UserDataContext
} from '../../../../globalState';
import {
	BookingEventsInterface,
	BookingEventUiInterface
} from '../../../../globalState/interfaces/BookingsInterface';
import { apiGetConsultantAppointments } from '../../../../api/apiGetConsultantAppointments';
import { apiAppointmentsServiceBookingEventsByAskerId } from '../../../../api';
import { BookingsStatus } from '../../../../utils/consultant';
import { transformBookingData } from '../../../../utils/transformBookingData';
import { BookingsComponent } from '../BookingsComponent/bookingsComponent';

export const BookingEventsBooked: React.FC = () => {
	const { userData } = useContext(UserDataContext);

	const [isLoading, setIsLoading] = useState(true);

	const isConsultant = hasUserAuthority(
		AUTHORITIES.CONSULTANT_DEFAULT,
		userData
	);

	const [bookingEventsData, setBookingEventsData] = useState<
		BookingEventUiInterface[]
	>([] as BookingEventUiInterface[]);

	useEffect(() => {
		if (isConsultant) {
			apiGetConsultantAppointments(userData.userId, BookingsStatus.ACTIVE)
				.then((bookings) => {
					setIsLoading(true);
					transformData(bookings);
				})
				.finally(() => {
					setIsLoading(false);
				});
		} else {
			apiAppointmentsServiceBookingEventsByAskerId(userData.userId)
				.then((bookings) => {
					setIsLoading(true);
					transformData(bookings);
				})
				.finally(() => {
					setIsLoading(false);
				});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const transformData = (bookings: BookingEventsInterface[]) => {
		const bookingEvents = transformBookingData(bookings);
		setBookingEventsData(bookingEvents);
	};

	return (
		<>
			{bookingEventsData && (
				<BookingsComponent
					bookingEventsData={bookingEventsData}
					isLoading={isLoading}
					bookingStatus={BookingsStatus.ACTIVE}
				/>
			)}
		</>
	);
};

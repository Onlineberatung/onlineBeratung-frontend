import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import {
	setBookingWrapperActive,
	setBookingWrapperInactive
} from '../app/navigationHandler';
import { UserDataContext } from '../../globalState';
import {
	BookingEventsInterface,
	BookingEventUiInterface
} from '../../globalState/interfaces/BookingsInterface';
import { apiGetConsultantAppointments } from '../../api/apiGetConsultantAppointments';
import { BookingsStatus } from '../../utils/consultant';
import { BookingsComponent } from './bookingsComponent';
import { transformBookingData } from '../../utils/transformBookingData';

export const BookingEventsCanceled: React.FC = () => {
	useEffect(() => {
		setBookingWrapperActive();

		return () => {
			setBookingWrapperInactive();
		};
	}, []);

	const { userData } = useContext(UserDataContext);
	const [isLoading, setIsLoading] = useState(true);
	const [bookingEventsData, setBookingEventsData] = useState<
		BookingEventUiInterface[]
	>([] as BookingEventUiInterface[]);

	useEffect(() => {
		apiGetConsultantAppointments(userData.userId, BookingsStatus.CANCELLED)
			.then((bookings) => {
				transformData(bookings);
			})
			.finally(() => {
				setIsLoading(false);
			});
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
					bookingStatus={BookingsStatus.CANCELLED}
				/>
			)}
		</>
	);
};

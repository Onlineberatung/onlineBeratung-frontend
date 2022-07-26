import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import {
	setBookingWrapperActive,
	setBookingWrapperInactive
} from '../app/navigationHandler';
import './bookingEvents.styles';
import {
	AUTHORITIES,
	hasUserAuthority,
	UserDataContext
} from '../../globalState';
import {
	BookingEventsInterface,
	BookingEventUiInterface
} from '../../globalState/interfaces/BookingsInterface';
import { apiGetConsultantAppointments } from '../../api/apiGetConsultantAppointments';
import { apiAppointmentsServiceBookingEventsByAskerId } from '../../api';
import { BookingsStatus } from '../../utils/consultant';
import { BookingsComponent } from './bookingsComponent';
import { transformBookingData } from '../../utils/transformBookingData';

export const BookingEventsBooked: React.FC = () => {
	useEffect(() => {
		setBookingWrapperActive();

		return () => {
			setBookingWrapperInactive();
		};
	}, []);

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

import {
	BookingEventUiInterface,
	BookingEventsInterface
} from '../globalState/interfaces';
import { addMissingZero, convertUTCDateToLocalDate } from './dateHelpers';

export const transformBookingData = (bookings: BookingEventsInterface[]) => {
	let bookingEvents: BookingEventUiInterface[] = [];
	bookings?.forEach((event: BookingEventsInterface) => {
		const startTime = new Date(
			convertUTCDateToLocalDate(new Date(event.startTime)).toLocaleString(
				'en-ZA'
			)
		);
		const endTime = new Date(
			convertUTCDateToLocalDate(new Date(event.endTime)).toLocaleString(
				'en-ZA'
			)
		);
		const date = new Date(event.startTime).toLocaleDateString('de-de', {
			weekday: 'long',
			year: '2-digit',
			month: '2-digit',
			day: '2-digit'
		});
		const duration = `${addMissingZero(
			startTime.getHours()
		)}:${addMissingZero(startTime.getUTCMinutes())} - ${addMissingZero(
			endTime.getHours()
		)}:${addMissingZero(endTime.getUTCMinutes())}`;

		bookingEvents.push({
			id: event.id,
			date,
			title: event.title,
			duration,
			location: event.location,
			askerId: event.askerId,
			askerName: event.askerName,
			counselor: event.consultantName,
			description: event.description,
			expanded: false,
			uid: event.uid,
			rescheduleLink: event.rescheduleLink,
			videoAppointmentId: event.videoAppointmentId
		});
	});
	return bookingEvents;
};

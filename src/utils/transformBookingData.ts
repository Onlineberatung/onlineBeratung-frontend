import {
	BookingEventUiInterface,
	BookingEventsInterface
} from '../globalState/interfaces/BookingsInterface';
import { addMissingZero } from './dateHelpers';

export const transformBookingData = (bookings: BookingEventsInterface[]) => {
	let bookingEvents: BookingEventUiInterface[] = [];
	bookings?.forEach((event: BookingEventsInterface) => {
		const startTime = new Date(event.startTime);
		const endTime = new Date(event.endTime);
		const date = new Date(event.startTime).toLocaleDateString('de-de', {
			weekday: 'long',
			year: '2-digit',
			month: '2-digit',
			day: '2-digit'
		});
		const duration = `${addMissingZero(
			startTime.getUTCHours()
		)}:${addMissingZero(startTime.getUTCMinutes())} - ${addMissingZero(
			endTime.getUTCHours()
		)}:${addMissingZero(endTime.getUTCMinutes())}`;

		bookingEvents.push({
			id: event.id,
			date,
			title: event.title,
			duration,
			askerId: event.askerId,
			askerName: event.askerName,
			counselor: event.consultantName,
			description: event.description,
			expanded: false,
			uid: event.uid,
			rescheduleLink: event.rescheduleLink
		});
	});
	return bookingEvents;
};

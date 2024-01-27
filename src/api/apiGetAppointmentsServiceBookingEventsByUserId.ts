import { BookingEventsInterface } from '../globalState/interfaces';
import { endpoints } from '../resources/scripts/endpoints';
import { fetchData, FETCH_METHODS } from './fetchData';

export const apiAppointmentsServiceBookingEventsByAskerId = async (
	userId: string
): Promise<BookingEventsInterface[]> => {
	const url = endpoints.appointmentsServiceBookingEventsByUserId(userId);

	return fetchData({
		url,
		method: FETCH_METHODS.GET
	});
};

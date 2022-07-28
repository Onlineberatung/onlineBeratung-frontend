import { BookingEventsInterface } from '../globalState/interfaces/BookingsInterface';
import { config } from '../resources/scripts/config';
import { BookingsStatus } from '../utils/consultant';
import { fetchData, FETCH_METHODS } from './fetchData';

export const apiGetConsultantAppointments = async (
	userId: string,
	status: BookingsStatus
): Promise<BookingEventsInterface[]> => {
	const url = config.endpoints.appointmentsServiceConsultantBookings(
		userId,
		status
	);

	return fetchData({
		url,
		method: FETCH_METHODS.GET
	});
};

import { BookingEventsInterface } from '../globalState/interfaces';
import { endpoints } from '../resources/scripts/endpoints';
import { BookingsStatus } from '../utils/consultant';
import { fetchData, FETCH_METHODS } from './fetchData';

export const apiGetConsultantAppointments = async (
	userId: string,
	status: BookingsStatus
): Promise<BookingEventsInterface[]> => {
	const url = endpoints.appointmentsServiceConsultantBookings(userId, status);

	return fetchData({
		url,
		method: FETCH_METHODS.GET
	});
};

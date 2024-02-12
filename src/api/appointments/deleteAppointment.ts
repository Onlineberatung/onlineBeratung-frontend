import { endpoints } from '../../resources/scripts/endpoints';
import { fetchData, FETCH_METHODS, FETCH_ERRORS } from './../fetchData';
import { AppointmentsDataInterface } from '../../globalState/interfaces';

export const deleteAppointment = async (
	appointmentId: string
): Promise<AppointmentsDataInterface> => {
	const url = endpoints.appointmentsServiceBase + '/' + appointmentId;

	return fetchData({
		url: url,
		method: FETCH_METHODS.DELETE,
		responseHandling: [FETCH_ERRORS.CATCH_ALL_WITH_RESPONSE]
	});
};

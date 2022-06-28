import { config } from '../../resources/scripts/config';
import { fetchData, FETCH_METHODS, FETCH_ERRORS } from './../fetchData';
import { AppointmentsDataInterface } from '../../globalState/interfaces/AppointmentsDataInterface';

export const deleteAppointment = async (
	appointmentId: string
): Promise<AppointmentsDataInterface> => {
	const url = config.endpoints.appointmentsServiceBase + '/' + appointmentId;

	return fetchData({
		url: url,
		method: FETCH_METHODS.DELETE,
		responseHandling: [FETCH_ERRORS.CATCH_ALL_WITH_RESPONSE]
	});
};

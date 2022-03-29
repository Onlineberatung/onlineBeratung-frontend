import { AppointmentsDataInterface } from '../../globalState/interfaces/AppointmentsDataInterface';
import { config } from '../../resources/scripts/config';
import { FETCH_ERRORS, FETCH_METHODS, fetchData } from '../fetchData';

export const getAppointment = async (
	appointmentId: string
): Promise<AppointmentsDataInterface> => {
	const url = config.endpoints.appointmentsServiceBase + '/' + appointmentId;

	return fetchData({
		url: url,
		method: FETCH_METHODS.GET,
		responseHandling: [FETCH_ERRORS.CATCH_ALL_WITH_RESPONSE]
	});
};

import { endpoints } from '../../resources/scripts/endpoints';
import { fetchData, FETCH_METHODS, FETCH_ERRORS } from './../fetchData';
import {
	AppointmentsDataInterface,
	STATUS_CREATED
} from '../../globalState/interfaces';

export const postAppointments = async (
	data: Partial<AppointmentsDataInterface>
): Promise<AppointmentsDataInterface> => {
	const url = endpoints.appointmentsServiceBase;

	return fetchData({
		url: url,
		method: FETCH_METHODS.POST,
		bodyData: JSON.stringify({
			...data,
			status: STATUS_CREATED
		}),
		responseHandling: [FETCH_ERRORS.CATCH_ALL_WITH_RESPONSE]
	});
};

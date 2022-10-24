import { endpoints } from '../resources/scripts/endpoints';
import { fetchData, FETCH_METHODS, FETCH_ERRORS } from './fetchData';

export const apiUpdatePasswordAppointments = async (
	email: string,
	password: string
): Promise<any> => {
	const url = endpoints.appointmentServiceCalDav;

	return fetchData({
		url: url,
		method: FETCH_METHODS.POST,
		bodyData: JSON.stringify({ email, password }),
		responseHandling: [FETCH_ERRORS.BAD_REQUEST]
	});
};

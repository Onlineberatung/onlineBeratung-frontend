import { config } from '../resources/scripts/config';
import { fetchData, FETCH_METHODS } from './fetchData';

export const getCounselorAppointmentLink = async (
	userId: string
): Promise<{ slug: string }> => {
	const url = config.endpoints.appointmentServiceEventTypes(userId);

	return fetchData({
		url,
		method: FETCH_METHODS.GET
	});
};

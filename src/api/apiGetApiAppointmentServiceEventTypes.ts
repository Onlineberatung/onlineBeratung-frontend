import { endpoints } from '../resources/scripts/endpoints';
import { fetchData, FETCH_METHODS } from './fetchData';

export const getCounselorAppointmentLink = async (
	userId: string
): Promise<{ slug: string }> => {
	const url = endpoints.counselorAppointmentLink(userId);

	return fetchData({
		url,
		method: FETCH_METHODS.GET
	});
};

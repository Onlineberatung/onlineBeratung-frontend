import { endpoints } from '../resources/scripts/endpoints';
import { fetchData, FETCH_METHODS } from './fetchData';
//TODO Andre: same here regarding renaming and frontend-theme
export const getTeamAppointmentLink = async (
	agencyId: number
): Promise<{ slug: string }> => {
	const url = endpoints.appointmentServiceMeetingLink(agencyId);

	return fetchData({
		url,
		method: FETCH_METHODS.GET
	});
};

import { config } from '../resources/scripts/config';
import { fetchData, FETCH_METHODS } from './fetchData';

export const apiAppointmentServiceTeamById = async (
	agencyId: number
): Promise<{ meetlingLink: string }> => {
	const url =
		config.endpoints.appointmentServiceBase +
		agencyId +
		'/initialMeetingLink';

	return fetchData({
		url: url,
		method: FETCH_METHODS.GET
	});
};

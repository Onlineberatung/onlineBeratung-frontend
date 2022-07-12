import { config } from '../resources/scripts/config';
import { fetchData, FETCH_METHODS } from './fetchData';

export const apiGetCalComTeamById = async (
	agencyId: number
): Promise<{ meetlingLink: string }> => {
	const url =
		config.urls.appointmentServiceDevServer +
		agencyId +
		'/initialMeetingLink';

	return fetchData({
		url: url,
		method: FETCH_METHODS.GET
	});
};

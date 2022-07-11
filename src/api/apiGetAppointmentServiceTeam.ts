import { config } from '../resources/scripts/config';
import { fetchData, FETCH_METHODS } from './fetchData';

export const apiAppointmentServiceTeamById = async (
	agencyId: number
): Promise<{ slug: string }> => {
	const url = config.endpoints.appointmentServiceMeetingLink(agencyId);

	return fetchData({
		url,
		method: FETCH_METHODS.GET
	});
};

export const apiAppointmentServiceEventTypes = async (
	userId: string
): Promise<{ slug: string }> => {
	const url = config.endpoints.appointmentServiceEventTypes(userId);

	return fetchData({
		url,
		method: FETCH_METHODS.GET
	});
};

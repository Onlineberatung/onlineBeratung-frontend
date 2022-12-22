import { endpoints } from '../resources/scripts/endpoints';
import { fetchData, FETCH_METHODS, FETCH_ERRORS } from './fetchData';

export interface AnonymousConversationAvailabilityInterface {
	numAvailableConsultants: number;
	status: string;
}

export const apiAnonymousConversationAvailability = async (
	sessionId: number
): Promise<AnonymousConversationAvailabilityInterface> => {
	const url = `${endpoints.anonymousBase}${sessionId}`;

	return fetchData({
		url: url,
		method: FETCH_METHODS.GET,
		responseHandling: [FETCH_ERRORS.CONFLICT, FETCH_ERRORS.ABORTED]
	});
};

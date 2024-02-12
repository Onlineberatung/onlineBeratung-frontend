import { endpoints } from '../resources/scripts/endpoints';
import { fetchData, FETCH_METHODS, FETCH_ERRORS } from './fetchData';
import { ConsultingSessionDataInterface } from '../globalState/interfaces';

export const apiGetUserDataBySessionId = async (
	sessionId: number
): Promise<ConsultingSessionDataInterface> => {
	return fetchData({
		url: endpoints.userDataBySessionId(sessionId),
		rcValidation: true,
		method: FETCH_METHODS.GET,
		responseHandling: [FETCH_ERRORS.FORBIDDEN]
	});
};

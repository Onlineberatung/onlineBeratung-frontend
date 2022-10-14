import { ConsultingSessionDataInterface } from '../globalState/interfaces/ConsultingSessionDataInterface';
import { endpoints } from '../resources/scripts/endpoints';
import { fetchData, FETCH_METHODS } from './fetchData';

export const apiGetUserDataBySessionId = async (
	sessionId: number
): Promise<ConsultingSessionDataInterface> => {
	return fetchData({
		url: endpoints.userDataBySessionId(sessionId),
		rcValidation: true,
		method: FETCH_METHODS.GET
	});
};

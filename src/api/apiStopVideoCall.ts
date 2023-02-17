import { endpoints } from '../resources/scripts/endpoints';
import { fetchData, FETCH_METHODS, FETCH_SUCCESS } from './fetchData';

export const apiStopVideoCall = async (roomId: string): Promise<void> => {
	const url = endpoints.stopVideoCall + '/' + roomId;

	return fetchData({
		url: url,
		method: FETCH_METHODS.POST,
		responseHandling: [FETCH_SUCCESS.CONTENT],
		rcValidation: true
	});
};

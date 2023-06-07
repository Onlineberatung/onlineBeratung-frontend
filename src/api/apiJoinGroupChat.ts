import { endpoints } from '../resources/scripts/endpoints';
import {
	fetchData,
	FETCH_METHODS,
	FETCH_ERRORS,
	FETCH_SUCCESS
} from './fetchData';

export const apiJoinGroupChat = async (roomId: string): Promise<any> =>
	fetchData({
		url: endpoints.videocallServiceBase + '/join/' + roomId,
		method: FETCH_METHODS.POST,
		responseHandling: [
			FETCH_ERRORS.CONFLICT,
			FETCH_ERRORS.CATCH_ALL,
			FETCH_SUCCESS.CONTENT
		]
	});

import { endpoints } from '../resources/scripts/endpoints';
import { fetchData, FETCH_METHODS } from './fetchData';

export const apiRejectVideoCall = async (
	initiatorUsername: string,
	rcGroupId: string,
	initiatorRcUserId: string
): Promise<void> => {
	const url = endpoints.rejectVideoCall;
	const rejectVideoCallData = JSON.stringify({
		initiatorRcUserId: initiatorRcUserId,
		initiatorUsername: initiatorUsername,
		rcGroupId: rcGroupId
	});

	return fetchData({
		url: url,
		method: FETCH_METHODS.POST,
		bodyData: rejectVideoCallData
	});
};

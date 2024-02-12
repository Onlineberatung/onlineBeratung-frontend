import { VideoCallJwtDataInterface } from '../../globalState/interfaces';
import { endpoints } from '../../resources/scripts/endpoints';
import { FETCH_ERRORS, FETCH_METHODS, fetchData } from '../fetchData';

export const getJwt = async (
	appointmentId: string,
	skipAuth: boolean = false
): Promise<VideoCallJwtDataInterface> => {
	const url = endpoints.videocallServiceBase + '/' + appointmentId + '/jwt';

	return fetchData({
		url: url,
		method: FETCH_METHODS.GET,
		responseHandling: [FETCH_ERRORS.CATCH_ALL_WITH_RESPONSE],
		skipAuth: skipAuth
	});
};

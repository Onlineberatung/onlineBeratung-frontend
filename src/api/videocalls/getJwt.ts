import { VideoCallJwtDataInterface } from '../../globalState/interfaces/VideoCallDataInterface';
import { config } from '../../resources/scripts/config';
import { FETCH_ERRORS, FETCH_METHODS, fetchData } from '../fetchData';

export const getJwt = async (
	appointmentId: string
): Promise<VideoCallJwtDataInterface> => {
	const url =
		config.endpoints.videocallServiceBase + '/' + appointmentId + '/jwt';

	return fetchData({
		url: url,
		method: FETCH_METHODS.GET,
		responseHandling: [FETCH_ERRORS.CATCH_ALL_WITH_RESPONSE]
	});
};

import { config } from '../resources/scripts/config';
import { FETCH_METHODS, fetchData } from './fetchData';

export const apiPostAskerBan = ({
	rcUserId,
	chatId,
	rcToken
}): Promise<any> => {
	const url = config.endpoints.banAsker(rcUserId, chatId);

	return fetchData({
		url: url,
		method: FETCH_METHODS.POST,
		bodyData: JSON.stringify({ chatConsultantToken: rcToken })
	});
};

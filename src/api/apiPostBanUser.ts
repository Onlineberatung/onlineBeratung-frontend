import { config } from '../resources/scripts/config';
import { FETCH_METHODS, fetchData } from './fetchData';

export const apiPostBanUser = ({ rcUserId, chatId }): Promise<any> => {
	const url = config.endpoints.banUser(rcUserId, chatId);

	return fetchData({
		url: url,
		method: FETCH_METHODS.POST,
		rcValidation: true,
		responseHandling: []
	});
};

import { getValueFromCookie } from '../components/sessionCookie/accessSessionCookie';
import { config } from '../resources/scripts/config';
import { FETCH_METHODS, fetchData } from './fetchData';

export const apiPostBanUser = ({ rcUserId, chatId }): Promise<any> => {
	const url = config.endpoints.banUser(rcUserId, chatId);
	const rcToken = getValueFromCookie('rc_token');

	return fetchData({
		url: url,
		method: FETCH_METHODS.POST,
		bodyData: JSON.stringify({ chatConsultantToken: rcToken })
	});
};

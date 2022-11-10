import { generatePath } from 'react-router-dom';
import { endpoints } from '../resources/scripts/endpoints';
import { fetchData, FETCH_METHODS } from './fetchData';

export const apiDeleteMessage = async (messageId: string): Promise<any> => {
	return fetchData({
		url: generatePath(endpoints.messages.delete, { messageId }),
		rcValidation: true,
		method: FETCH_METHODS.DELETE
	});
};

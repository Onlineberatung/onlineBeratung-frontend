import { generatePath } from 'react-router-dom';
import { endpoints } from '../resources/scripts/endpoints';
import { fetchData, FETCH_METHODS } from './fetchData';

export const apiDeleteMessage = async (id: string): Promise<any> => {
	return fetchData({
		url: generatePath(endpoints.message.delete, { id }),
		rcValidation: true,
		method: FETCH_METHODS.DELETE
	});
};

import { endpoints } from '../resources/scripts/endpoints';
import { FETCH_METHODS, fetchData, FETCH_ERRORS } from './fetchData';
import { generatePath } from 'react-router-dom';

export const apiGetMessage = async (
	id: string,
	signal?: AbortSignal
): Promise<any> => {
	return fetchData({
		url: generatePath(endpoints.message.get, { id }),
		method: FETCH_METHODS.GET,
		rcValidation: true,
		responseHandling: [FETCH_ERRORS.EMPTY, FETCH_ERRORS.CATCH_ALL],
		...(signal && { signal: signal })
	});
};

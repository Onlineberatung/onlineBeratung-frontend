import { endpoints } from '../resources/scripts/endpoints';
import { fetchData, FETCH_METHODS } from './fetchData';

let previousProm = null;

export const apiGetAskerSessionList = async (): Promise<any> => {
	const url = endpoints.askerSessions;

	// ToDo: We are calling this endpoint on multiple places at the same time which makes the tests flaky
	// This is a quick fix to prevent multiple calls to the same endpoint and should better be refactored
	if (previousProm) {
		return previousProm;
	}

	previousProm = fetchData({
		url: url,
		method: FETCH_METHODS.GET,
		rcValidation: true
	}).finally(() => {
		previousProm = null;
	});
	return previousProm;
};

import { config } from '../resources/scripts/config';
import { fetchData, FETCH_METHODS } from './fetchData';

export const apiUpdateMonitoring = async (
	sessionId: number,
	monitoringData: object
) => {
	const url = config.endpoints.updateMonitoring + '/' + sessionId;
	const monitoring = JSON.stringify(monitoringData);

	return fetchData({
		url: url,
		method: FETCH_METHODS.PUT,
		rcValidation: true,
		bodyData: monitoring
	});
};

import { endpoints } from '../resources/scripts/endpoints';
import { fetchData, FETCH_METHODS } from './fetchData';

export const apiSetAbsence = async (
	absentBoolVal: boolean,
	message: string
) => {
	const url = endpoints.setAbsence;
	const absenceData = JSON.stringify({
		absent: absentBoolVal,
		message: message ?? null
	});

	return fetchData({
		url: url,
		method: FETCH_METHODS.PUT,
		bodyData: absenceData
	});
};

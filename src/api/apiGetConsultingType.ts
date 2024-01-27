import { ConsultingTypeInterface } from '../globalState/interfaces';
import { endpoints } from '../resources/scripts/endpoints';
import { fetchData, FETCH_ERRORS, FETCH_METHODS } from './fetchData';

export const apiGetConsultingType = async (params: {
	consultingTypeSlug?: string;
	consultingTypeId?: number;
}): Promise<ConsultingTypeInterface> => {
	let promise;
	if (params.consultingTypeSlug != null) {
		promise = fetchData({
			url: `${endpoints.consultingTypeServiceBase}/byslug/${params.consultingTypeSlug}/full`,
			method: FETCH_METHODS.GET,
			skipAuth: true,
			responseHandling: [FETCH_ERRORS.NO_MATCH]
		});
	} else if (params.consultingTypeId !== null) {
		promise = fetchData({
			url: `${endpoints.consultingTypeServiceBase}/${params.consultingTypeId}/full`,
			method: FETCH_METHODS.GET,
			skipAuth: true,
			responseHandling: [FETCH_ERRORS.NO_MATCH]
		});
	}

	return promise.catch((error) => {
		if (error.message === FETCH_ERRORS.NO_MATCH) {
			return null;
		}

		throw error;
	});
};

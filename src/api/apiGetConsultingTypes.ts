import { ConsultingTypeBasicInterface } from '../globalState/interfaces';
import { endpoints } from '../resources/scripts/endpoints';
import { fetchData, FETCH_METHODS } from './fetchData';

export const apiGetConsultingTypes = async (): Promise<
	Array<ConsultingTypeBasicInterface>
> => {
	return fetchData({
		url: `${endpoints.consultingTypeServiceBase}/basic`,
		method: FETCH_METHODS.GET,
		skipAuth: true
	});
};

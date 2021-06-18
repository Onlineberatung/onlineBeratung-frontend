import { ConsultingTypeBasicInterface } from '../globalState';
import { config } from '../resources/scripts/config';
import { fetchData, FETCH_METHODS } from './fetchData';

export const apiGetConsultingTypes = async (): Promise<
	Array<ConsultingTypeBasicInterface>
> => {
	return fetchData({
		url: `${config.endpoints.consultingTypeServiceBase}/basic`,
		method: FETCH_METHODS.GET,
		skipAuth: true
	});
};

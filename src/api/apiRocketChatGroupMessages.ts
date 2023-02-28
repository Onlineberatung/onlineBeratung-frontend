import { endpoints } from '../resources/scripts/endpoints';
import { fetchRCData } from './fetchRCData';
import {
	PaginationParams,
	parseParams,
	QueryFieldsParams
} from '../components/app/RocketChat';

export async function apiRocketChatGroupMessages(
	rid: string,
	params?: QueryFieldsParams & PaginationParams
): Promise<any> {
	const queryParams = parseParams(params);
	const url = `${endpoints.rc.groups.messages}?roomId=${rid}${
		queryParams.length ? `&${queryParams.join('&')}` : ''
	}`;
	return fetchRCData(url, 'GET', null, true);
}

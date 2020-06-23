import { config } from '../../../resources/ts/config';
import {
	typeIsSession,
	typeIsTeamSession
} from '../../session/ts/sessionHelpers';
import { ListItemsResponseInterface } from '../../../globalState';
import { fetchData, FETCH_METHODS, FETCH_ERRORS } from './fetchData';

export const INITIAL_FILTER: string = 'all';
export const INITIAL_OFFSET: number = 0;
export const SESSION_COUNT: number = 15;

export const ajaxCallGetSessionsListData = async (
	type: string,
	filter: string = INITIAL_FILTER,
	offset: number = INITIAL_OFFSET
): Promise<ListItemsResponseInterface> => {
	const isTeamSession: boolean = typeIsTeamSession(type);
	let url = null;
	if (isTeamSession) {
		url = config.endpoints.teamSessions + '?';
	} else if (!isTeamSession && typeIsSession(type)) {
		url = config.endpoints.sessions + '&';
	} else {
		url = config.endpoints.enquiries + '&';
	}
	url = url + `count=${SESSION_COUNT}&filter=${filter}&offset=${offset}`;

	const timeout = 10000;

	return fetchData({
		url: url,
		method: FETCH_METHODS.GET,
		rcValidation: true,
		responseHandling: [FETCH_ERRORS.EMPTY],
		timeout: timeout
	});
};

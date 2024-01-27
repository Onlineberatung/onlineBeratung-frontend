import { endpoints } from '../resources/scripts/endpoints';
import {
	SESSION_LIST_TAB_ANONYMOUS,
	SESSION_LIST_TAB_ARCHIVE,
	SESSION_LIST_TYPES
} from '../components/session/sessionHelpers';
import { ListItemsResponseInterface } from '../globalState/interfaces';
import { FETCH_ERRORS, FETCH_METHODS, fetchData } from './fetchData';

export const INITIAL_FILTER: string = 'all';
export const FILTER_FEEDBACK: string = 'feedback';
export const INITIAL_OFFSET: number = 0;
export const SESSION_COUNT: number = 15;
export const TIMEOUT: number = 10000;

export interface ApiGetConsultantSessionListInterface {
	type: SESSION_LIST_TYPES;
	filter?: typeof INITIAL_FILTER | typeof FILTER_FEEDBACK;
	offset?: number;
	sessionListTab?: string;
	count?: number;
	signal?: AbortSignal;
}

export const apiGetConsultantSessionList = async ({
	type,
	filter = INITIAL_FILTER,
	offset = INITIAL_OFFSET,
	sessionListTab,
	count = SESSION_COUNT,
	signal
}: ApiGetConsultantSessionListInterface): Promise<ListItemsResponseInterface> => {
	const isTeamSession: boolean = type === SESSION_LIST_TYPES.TEAMSESSION;
	let url: string;
	if (isTeamSession) {
		url = `${
			sessionListTab === SESSION_LIST_TAB_ARCHIVE
				? `${endpoints.teamSessionsBase}${SESSION_LIST_TAB_ARCHIVE}?`
				: `${endpoints.consultantTeamSessions}`
		}`;
	} else if (type === SESSION_LIST_TYPES.MY_SESSION) {
		url = `${
			sessionListTab === SESSION_LIST_TAB_ARCHIVE
				? `${endpoints.myMessagesBase}${SESSION_LIST_TAB_ARCHIVE}?`
				: `${endpoints.consultantSessions}`
		}`;
	} else {
		url = `${endpoints.consultantEnquiriesBase}${
			sessionListTab && sessionListTab === SESSION_LIST_TAB_ANONYMOUS
				? `${SESSION_LIST_TAB_ANONYMOUS}`
				: 'registered'
		}?`;
	}
	url = url + `count=${count}&filter=${filter}&offset=${offset}`;

	return fetchData({
		url: url,
		method: FETCH_METHODS.GET,
		rcValidation: true,
		responseHandling: [FETCH_ERRORS.EMPTY],
		timeout: TIMEOUT,
		...(signal && { signal: signal })
	});
};

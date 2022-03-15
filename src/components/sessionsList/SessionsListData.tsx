import { apiGetConsultantSessionList, FETCH_ERRORS } from '../../api';
import {
	SESSION_LIST_TYPES,
	typeIsTeamSession,
	typeIsEnquiry
} from '../session/sessionHelpers';
import {
	ListItemsResponseInterface,
	ListItemInterface,
	getSessionsDataKeyForSessionType
} from '../../globalState';

interface GetSessionsProps {
	context: any;
	type: SESSION_LIST_TYPES;
	offset: number;
	useFilter: string;
	sessionListTab?: string;
	signal?: AbortSignal;
	count?: number;
}

export const getConsultantSessions = ({
	context,
	type,
	offset,
	useFilter,
	sessionListTab,
	signal,
	count
}: GetSessionsProps): Promise<any> => {
	const { sessionsData, setSessionsData } = context;
	const isOffsetIncreased = Boolean(offset);

	const setSessionsDataForCurrentType = (
		fetchedSessions: ListItemInterface[],
		increaseOffset?: boolean
	) => {
		const newSessions =
			increaseOffset && sessionsData
				? [
						...sessionsData[getSessionsDataKeyForSessionType(type)],
						...fetchedSessions
				  ]
				: fetchedSessions;

		if (type === SESSION_LIST_TYPES.ENQUIRY) {
			setSessionsData({
				...sessionsData,
				enquiries: newSessions
			});
		}
		if (type === SESSION_LIST_TYPES.MY_SESSION) {
			setSessionsData({
				...sessionsData,
				mySessions: newSessions
			});
		}
		if (type === SESSION_LIST_TYPES.TEAMSESSION) {
			setSessionsData({
				...sessionsData,
				teamSessions: newSessions
			});
		}
	};

	const fetchMySessionsDatas = (
		fetchedSessions,
		increaseOffset?: boolean
	): Promise<void> =>
		new Promise((resolve, reject) => {
			const enquiriesList =
				fetchedSessions && typeIsEnquiry(type)
					? increaseOffset
						? {
								enquiries: [
									...sessionsData[
										getSessionsDataKeyForSessionType(type)
									],
									...fetchedSessions
								]
						  }
						: { enquiries: fetchedSessions }
					: null;

			const teamSessionsList =
				fetchedSessions && typeIsTeamSession(type)
					? increaseOffset
						? {
								teamSessions: [
									...sessionsData[
										getSessionsDataKeyForSessionType(type)
									],
									...fetchedSessions
								]
						  }
						: { teamSessions: fetchedSessions }
					: null;

			apiGetConsultantSessionList({
				type: SESSION_LIST_TYPES.MY_SESSION,
				filter: 'all',
				offset: 0
			})
				.then((fetchedMySessions: ListItemsResponseInterface) => {
					setSessionsData({
						...enquiriesList,
						mySessions: fetchedMySessions.sessions,
						...teamSessionsList
					});
					resolve();
				})
				.catch((error) => {
					if (fetchedSessions) {
						setSessionsData({
							...enquiriesList,
							...teamSessionsList
						});
						resolve();
					} else {
						reject(error);
					}
				});
		});

	return new Promise((resolve, reject) => {
		apiGetConsultantSessionList({
			type: type,
			filter: useFilter,
			offset: offset,
			sessionListTab: sessionListTab,
			...(signal && { signal }),
			...(count && { count })
		})
			.then((sessionList: ListItemsResponseInterface) => {
				const fetchedSessions: ListItemInterface[] =
					sessionList.sessions;
				if (
					type !== SESSION_LIST_TYPES.MY_SESSION &&
					!sessionsData?.mySessions
				) {
					fetchMySessionsDatas(fetchedSessions, isOffsetIncreased)
						.then(() => {
							resolve(sessionList);
						})
						.catch((error) => {
							if (error.message === FETCH_ERRORS.EMPTY) {
								reject(error);
							}
						});
				} else {
					setSessionsDataForCurrentType(
						fetchedSessions,
						isOffsetIncreased
					);
					resolve(sessionList);
				}
			})
			.catch((error) => {
				if (error.message === FETCH_ERRORS.EMPTY) {
					setSessionsDataForCurrentType([], isOffsetIncreased);
				}
				reject(error);
			});
	});
};

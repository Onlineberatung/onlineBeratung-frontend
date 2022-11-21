import { useEffect, useState } from 'react';
import { apiGetConsultantSessionList } from '../../../api';
import { SESSION_LIST_TYPES } from '../../../components/session/sessionHelpers';
import { ListItemsResponseInterface } from '../../../globalState/interfaces/SessionsDataInterface';

interface ConsultantDataProps {
	type: SESSION_LIST_TYPES;
	unReadOnly?: boolean;
}
export const useConsultantData = ({
	type,
	unReadOnly
}: ConsultantDataProps) => {
	const [isLoading, setIsLoading] = useState(false);
	const [data, setData] = useState<ListItemsResponseInterface>({
		count: 0,
		offset: 0,
		sessions: [],
		total: 0
	});

	useEffect(() => {
		const abortController = new AbortController();
		setIsLoading(true);

		apiGetConsultantSessionList({
			type,
			count: 50,
			signal: abortController.signal
		})
			.then((data) => {
				if (unReadOnly) {
					// Since the backend doesn't support this filter we need to grab more messages
					// to filter by 9
					const sessions = data.sessions.filter(
						(session) =>
							session.session && !session.session.messagesRead
					);
					setData({
						...data,
						total: sessions.length,
						sessions
					});
				} else {
					setData(data);
				}
			})
			.finally(() => setIsLoading(false));

		return () => abortController.abort();
	}, [type, unReadOnly]);

	return { ...data, isLoading };
};

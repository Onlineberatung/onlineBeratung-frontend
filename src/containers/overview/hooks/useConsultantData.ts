import { useEffect, useState } from 'react';
import { apiGetConsultantSessionList } from '../../../api';
import { SESSION_LIST_TYPES } from '../../../components/session/sessionHelpers';
import { ListItemsResponseInterface } from '../../../globalState/interfaces/SessionsDataInterface';

interface ConsultantDataProps {
	type: SESSION_LIST_TYPES;
}
export const useConsultantData = ({ type }: ConsultantDataProps) => {
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
			count: 10,
			signal: abortController.signal
		})
			.then(setData)
			.finally(() => setIsLoading(false));

		return () => abortController.abort();
	}, [type]);

	return { ...data, isLoading };
};

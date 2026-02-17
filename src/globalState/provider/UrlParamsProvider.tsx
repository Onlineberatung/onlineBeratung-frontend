import React, {
	createContext,
	PropsWithChildren,
	useCallback,
	useMemo
} from 'react';
import {
	AgencyDataInterface,
	ConsultantDataInterface,
	ConsultingTypeInterface,
	TopicsDataInterface
} from '../interfaces';
import useUrlParamsLoader from '../../utils/useUrlParamsLoader';
import { useAppConfig } from '../../hooks/useAppConfig';

export const UrlParamsContext = createContext<{
	agency: AgencyDataInterface | null;
	consultingType: ConsultingTypeInterface | null;
	consultant: ConsultantDataInterface | null;
	topic: TopicsDataInterface | null;
	loaded: boolean;
	slugFallback: string;
	postcode: string | null;
	error: string | null;
}>({
	agency: null,
	consultingType: null,
	consultant: null,
	topic: null,
	loaded: false,
	slugFallback: undefined,
	postcode: null,
	error: null
});

export const UrlParamsProvider = ({ children }: PropsWithChildren<{}>) => {
	const settings = useAppConfig();
	const handleBadRequest = useCallback(
		() => (document.location.href = settings.urls.toRegistration),
		[settings.urls.toRegistration]
	);
	const { agency, consultingType, consultant, topic, loaded, slugFallback, postcode, error } =
		useUrlParamsLoader(handleBadRequest);

	const context = useMemo(
		() => ({
			agency,
			consultingType,
			consultant,
			topic,
			loaded,
			slugFallback,
			postcode,
			error
		}),
		[agency, consultingType, consultant, topic, loaded, slugFallback, postcode, error]
	);

	return (
		<UrlParamsContext.Provider value={context}>
			{children}
		</UrlParamsContext.Provider>
	);
};

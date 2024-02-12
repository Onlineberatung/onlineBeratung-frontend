import React, { createContext, PropsWithChildren } from 'react';
import {
	AgencyDataInterface,
	ConsultantDataInterface,
	ConsultingTypeInterface,
	TopicsDataInterface
} from '../interfaces';
import useUrlParamsLoader from '../../utils/useUrlParamsLoader';

export const UrlParamsContext = createContext<{
	agency: AgencyDataInterface | null;
	consultingType: ConsultingTypeInterface | null;
	consultant: ConsultantDataInterface | null;
	topic: TopicsDataInterface | null;
	loaded: boolean;
}>({
	agency: null,
	consultingType: null,
	consultant: null,
	topic: null,
	loaded: false
});

export const UrlParamsProvider = ({ children }: PropsWithChildren<{}>) => {
	const { agency, consultingType, consultant, topic, loaded } =
		useUrlParamsLoader();

	return (
		<UrlParamsContext.Provider
			value={{ agency, consultingType, consultant, topic, loaded }}
		>
			{children}
		</UrlParamsContext.Provider>
	);
};

import React, { createContext, FC } from 'react';
import {
	AgencyDataInterface,
	ConsultantDataInterface,
	ConsultingTypeInterface
} from '..';
import useUrlParamsLoader from '../../utils/useUrlParamsLoader';
import { TopicsDataInterface } from '../interfaces/TopicsDataInterface';

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

export const UrlParamsProvider: FC = ({ children }) => {
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

import * as React from 'react';
import { createContext, FC, useState } from 'react';

export let consultantList: [];

export const ConsultantListContext = createContext<any>(null);

export const ConsultantListProvider: FC = ({ children }) => {
	const [consultantList, setConsultantList] = useState([]);

	return (
		<ConsultantListContext.Provider
			value={{ consultantList, setConsultantList }}
		>
			{children}
		</ConsultantListContext.Provider>
	);
};

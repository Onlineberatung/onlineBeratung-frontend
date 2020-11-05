import * as React from 'react';
import { createContext, useState } from 'react';

export let consultantList: [];

export const ConsultantListContext = createContext<any>(null);

export function ConsultantListProvider(props) {
	const [consultantList, setConsultantList] = useState([]);

	return (
		<ConsultantListContext.Provider
			value={{ consultantList, setConsultantList }}
		>
			{props.children}
		</ConsultantListContext.Provider>
	);
}

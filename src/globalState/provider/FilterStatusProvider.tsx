import * as React from 'react';
import { createContext, useState } from 'react';

export let FilterStatus: string;

export const FilterStatusContext = createContext(null);

export function FilterStatusProvider(props) {
	const [filterStatus, setFilterStatus] = useState('all');

	return (
		<FilterStatusContext.Provider value={{ filterStatus, setFilterStatus }}>
			{props.children}
		</FilterStatusContext.Provider>
	);
}

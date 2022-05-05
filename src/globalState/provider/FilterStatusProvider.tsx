import * as React from 'react';
import { createContext, Dispatch, SetStateAction, useState } from 'react';
import { FILTER_FEEDBACK, INITIAL_FILTER } from '../../api';

export const FilterStatusContext = createContext<{
	filterStatus: typeof INITIAL_FILTER | typeof FILTER_FEEDBACK;
	setFilterStatus: Dispatch<SetStateAction<string>>;
}>(null);

export function FilterStatusProvider(props) {
	const [filterStatus, setFilterStatus] = useState<
		typeof INITIAL_FILTER | typeof FILTER_FEEDBACK
	>(INITIAL_FILTER);

	return (
		<FilterStatusContext.Provider value={{ filterStatus, setFilterStatus }}>
			{props.children}
		</FilterStatusContext.Provider>
	);
}

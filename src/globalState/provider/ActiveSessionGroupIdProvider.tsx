import * as React from 'react';
import { createContext, useState } from 'react';

export let ActiveSessionGroupId: string;

export const ActiveSessionGroupIdContext = createContext<any>(null);

export function ActiveSessionGroupIdProvider(props) {
	const [activeSessionGroupId, setActiveSessionGroupId] = useState(null);

	return (
		<ActiveSessionGroupIdContext.Provider
			value={{ activeSessionGroupId, setActiveSessionGroupId }}
		>
			{props.children}
		</ActiveSessionGroupIdContext.Provider>
	);
}

import * as React from 'react';
import { createContext, useState } from 'react';

export const SessionsDataContext = createContext(null);

export function SessionsDataProvider(props) {
	const [sessionsData, setSessionsData] = useState(null);

	return (
		<SessionsDataContext.Provider value={{ sessionsData, setSessionsData }}>
			{props.children}
		</SessionsDataContext.Provider>
	);
}

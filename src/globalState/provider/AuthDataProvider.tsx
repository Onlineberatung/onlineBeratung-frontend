import * as React from 'react';
import { createContext, useState } from 'react';

export const AuthDataContext = createContext<any>(null);

export function AuthDataProvider(props) {
	const [authData, setAuthData] = useState(null);

	return (
		<AuthDataContext.Provider value={{ authData, setAuthData }}>
			{props.children}
		</AuthDataContext.Provider>
	);
}

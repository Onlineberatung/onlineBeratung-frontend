import * as React from 'react';
import { createContext, useState } from 'react';

export const UserDataContext = createContext(null);

export function UserDataProvider(props) {
	const [userData, setUserData] = useState(null);

	return (
		<UserDataContext.Provider value={{ userData, setUserData }}>
			{props.children}
		</UserDataContext.Provider>
	);
}

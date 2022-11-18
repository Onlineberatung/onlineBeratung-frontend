import * as React from 'react';
import { createContext, useState } from 'react';
import { UserDataInterface } from '../interfaces/UserDataInterface';

type TUserDataContext = {
	userData: UserDataInterface;
	setUserData: (userData: UserDataInterface) => void;
};

export const UserDataContext = createContext<TUserDataContext>(null);

export function UserDataProvider(props) {
	const [userData, setUserData] = useState(null);

	return (
		<UserDataContext.Provider value={{ userData, setUserData }}>
			{props.children}
		</UserDataContext.Provider>
	);
}

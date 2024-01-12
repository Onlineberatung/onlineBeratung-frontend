import * as React from 'react';
import { createContext, useCallback, useState } from 'react';
import { UserDataInterface } from '../interfaces/UserDataInterface';
import { apiGetUserData } from '../../api';

type TUserDataContext = {
	userData: UserDataInterface;
	setUserData: (userData: UserDataInterface) => void;
	reloadUserData: () => Promise<UserDataInterface>;
};

export const UserDataContext = createContext<TUserDataContext>(null);

export function UserDataProvider(props) {
	const [userData, setUserData] = useState(null);

	const reloadUserData = useCallback(() => {
		return apiGetUserData().then((userData: UserDataInterface) => {
			setUserData(userData);
			return userData;
		});
	}, [setUserData]);

	return (
		<UserDataContext.Provider
			value={{
				userData,
				setUserData,
				reloadUserData
			}}
		>
			{props.children}
		</UserDataContext.Provider>
	);
}

import * as React from 'react';
import { createContext, FC, useCallback, useState } from 'react';
import { UserDataInterface } from '../interfaces/UserDataInterface';
import { apiGetUserData } from '../../api';

type TUserDataContext = {
	userData: UserDataInterface;
	setUserData: (userData: UserDataInterface) => void;
	reloadUserData: () => Promise<UserDataInterface>;
};

export const UserDataContext = createContext<TUserDataContext>(null);

export const UserDataProvider: FC = ({ children }) => {
	const [userData, setUserData] = useState(null);

	const reloadUserData = useCallback(() => {
		return apiGetUserData().then((userData: UserDataInterface) => {
			setUserData(userData);
			return userData;
		});
	}, [setUserData]);

	return (
		<UserDataContext.Provider
			value={{ userData, setUserData, reloadUserData }}
		>
			{children}
		</UserDataContext.Provider>
	);
};

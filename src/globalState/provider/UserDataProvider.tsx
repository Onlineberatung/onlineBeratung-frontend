import * as React from 'react';
import { useCallback, useState } from 'react';
import { UserDataInterface } from '../interfaces/UserDataInterface';
import { apiGetUserData } from '../../api';
import { UserDataContext } from '../context/UserDataContext';

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

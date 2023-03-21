import * as React from 'react';
import { createContext, useCallback, useState } from 'react';
import { UserDataInterface } from '../interfaces/UserDataInterface';
import { apiGetUserData } from '../../api';
import { useLocation } from 'react-router-dom';

type TUserDataContext = {
	isFirstVisit: boolean;
	userData: UserDataInterface;
	setUserData: (userData: UserDataInterface) => void;
	reloadUserData: () => Promise<UserDataInterface>;
};

export const UserDataContext = createContext<TUserDataContext>(null);
const isFirstVisitToBrowser = localStorage.getItem('visited') !== 'true';

export function UserDataProvider(props) {
	const location = useLocation();
	const [userData, setUserData] = useState(null);

	const reloadUserData = useCallback(() => {
		return apiGetUserData().then((userData: UserDataInterface) => {
			setUserData(userData);
			return userData;
		});
	}, [setUserData]);

	React.useEffect(() => {
		if (userData && location.pathname !== '/login') {
			localStorage.setItem('visited', 'true');
		}
	}, [location.pathname, userData]);

	return (
		<UserDataContext.Provider
			value={{
				isFirstVisit: isFirstVisitToBrowser,
				userData,
				setUserData,
				reloadUserData
			}}
		>
			{props.children}
		</UserDataContext.Provider>
	);
}

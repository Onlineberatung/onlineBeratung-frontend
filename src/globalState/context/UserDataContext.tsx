import { UserDataInterface } from '../interfaces/UserDataInterface';
import { createContext } from 'react';

type TUserDataContext = {
	userData: UserDataInterface;
	setUserData: (userData: UserDataInterface) => void;
	reloadUserData: () => Promise<UserDataInterface>;
};

export const UserDataContext = createContext<TUserDataContext>(null);

import { UserDataInterface } from '../globalState';

export const getuserEmail = (userData: UserDataInterface) => {
	return userData.email
		? userData.email
		: userData.userName + '@suchtberatung.digital';
};

import { useContext, useCallback } from 'react';
import { apiGetUserData } from '../api';
import { UserDataContext, UserDataInterface } from '../globalState';

export default function useUpdateUserData() {
	const { setUserData } = useContext(UserDataContext);

	const updateUserData = useCallback(() => {
		apiGetUserData()
			.then((newUserData: UserDataInterface) => {
				setUserData(newUserData);
			})
			.catch((error) => console.log(error));
	}, [setUserData]);

	return updateUserData;
}

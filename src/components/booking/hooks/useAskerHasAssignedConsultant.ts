import { useContext, useEffect, useState } from 'react';
import { apiGetAskerSessionList } from '../../../api/apiGetAskerSessionList';
import {
	AUTHORITIES,
	hasUserAuthority,
	SessionsDataContext,
	UserDataContext
} from '../../../globalState';

export const useAskerHasAssignedConsultant = () => {
	const { userData } = useContext(UserDataContext);
	const isAdviceSeeker = hasUserAuthority(
		AUTHORITIES.ASKER_DEFAULT,
		userData
	);
	const [hasAssignedConsultant, setAssignedConsultant] = useState(false);
	const { sessions } = useContext(SessionsDataContext);

	useEffect(() => {
		if (isAdviceSeeker) {
			apiGetAskerSessionList().then(({ sessions }) => {
				setAssignedConsultant(!!sessions?.[0]?.consultant);
			});
		}
	}, [userData, isAdviceSeeker, sessions]);

	return hasAssignedConsultant;
};

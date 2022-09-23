import { useContext, useEffect, useState } from 'react';
import { apiGetAskerSessionList } from '../../../api/apiGetAskerSessionList';
import {
	AUTHORITIES,
	hasUserAuthority,
	UserDataContext
} from '../../../globalState';

export const useAskerHasAssignedConsultant = () => {
	const { userData } = useContext(UserDataContext);
	const isAdviceSeeker = hasUserAuthority(
		AUTHORITIES.ASKER_DEFAULT,
		userData
	);
	const [hasAssignedConsultant, setAssignedConsultant] = useState(false);

	useEffect(() => {
		if (isAdviceSeeker) {
			apiGetAskerSessionList().then(({ sessions }) => {
				setAssignedConsultant(!!sessions?.[0]?.consultant);
			});
		}
	}, [userData, isAdviceSeeker]);

	return hasAssignedConsultant;
};

import { useContext, useEffect, useState } from 'react';
import { apiGetAskerSessionList } from '../../../api/apiGetAskerSessionList';
import {
	AUTHORITIES,
	hasUserAuthority,
	ListItemInterface,
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
	const hasConsultants = !!sessions
		.filter((session) => session.agency !== null)
		.map((consultant) => consultant);

	useEffect(() => {
		if (isAdviceSeeker) {
			apiGetAskerSessionList().then(({ sessions }) => {
				setAssignedConsultant(
					!!sessions
						.filter(
							(session: ListItemInterface) =>
								session.agency !== null
						)
						.map((consultant: ListItemInterface) => consultant)
				);
			});
		}
	}, [userData, isAdviceSeeker, hasConsultants]);

	return hasAssignedConsultant;
};

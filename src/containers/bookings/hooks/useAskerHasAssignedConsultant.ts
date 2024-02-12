import { useContext, useEffect, useState } from 'react';
import { apiGetAskerSessionList } from '../../../api';
import {
	AUTHORITIES,
	hasUserAuthority,
	UserDataContext
} from '../../../globalState';
import { ListItemInterface } from '../../../globalState/interfaces';

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
				setAssignedConsultant(
					!!sessions
						?.filter(
							(session: ListItemInterface) =>
								session.agency !== null
						)
						.map(
							(consultant: ListItemInterface) =>
								consultant.consultant
						)
						.filter((el) => el != null).length
				);
			});
		}
	}, [isAdviceSeeker]);

	return hasAssignedConsultant;
};

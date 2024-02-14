import * as React from 'react';
import {
	createContext,
	useState,
	useContext,
	Dispatch,
	SetStateAction,
	useEffect
} from 'react';
import { UserDataContext } from '../context/UserDataContext';
import { AgencyDataInterface } from '../interfaces';
import useUrlParamsLoader from '../../utils/useUrlParamsLoader';

export const AgencySpecificContext = createContext<{
	specificAgency: AgencyDataInterface;
	setSpecificAgency: Dispatch<SetStateAction<AgencyDataInterface>>;
}>(null);

export function AgencySpecificProvider(props) {
	const { userData } = useContext(UserDataContext);
	const { agency: urlAgency } = useUrlParamsLoader();
	const [agency, setAgency] = useState<AgencyDataInterface>();

	useEffect(() => {
		if (userData?.agencies?.length > 0) {
			setAgency(userData.agencies[0]);
		} else if (urlAgency) {
			setAgency(urlAgency);
		}
	}, [urlAgency, userData]);

	return (
		<AgencySpecificContext.Provider
			value={{ specificAgency: agency, setSpecificAgency: setAgency }}
		>
			{props.children}
		</AgencySpecificContext.Provider>
	);
}

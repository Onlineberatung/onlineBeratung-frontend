import * as React from 'react';
import {
	createContext,
	Dispatch,
	FC,
	SetStateAction,
	useEffect,
	useState
} from 'react';
import {
	getValueFromCookie,
	setValueInCookie
} from '../../components/sessionCookie/accessSessionCookie';

export const COOKIE_KEY = 'useInformal';

type TInformalContext = {
	informal?: boolean;
	setInformal?: Dispatch<SetStateAction<boolean>>;
};

export const InformalContext = createContext<TInformalContext>({});

export const InformalProvider: FC = ({ children }) => {
	const [informal, setInformal] = useState(false);

	useEffect(() => {
		setInformal(getValueFromCookie(COOKIE_KEY) === '1');
	}, []);

	useEffect(() => {
		setValueInCookie(COOKIE_KEY, informal ? '1' : '');
	}, [informal]);

	return (
		<InformalContext.Provider
			value={{
				informal,
				setInformal
			}}
		>
			{children}
		</InformalContext.Provider>
	);
};

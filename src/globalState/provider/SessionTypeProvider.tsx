import * as React from 'react';
import { createContext, FC, useContext, useEffect, useState } from 'react';
import { SESSION_LIST_TYPES } from '../../components/session/sessionHelpers';
import { UserDataContext } from './UserDataProvider';
import { AUTHORITIES, hasUserAuthority } from '../helpers/stateHelpers';

type SessionTypeProviderProps = {
	type: SESSION_LIST_TYPES;
	path: string;
};

export const SessionTypeContext = createContext<SessionTypeProviderProps>(null);

export const SessionTypeProvider: FC<
	Omit<SessionTypeProviderProps, 'path'>
> = ({ type, children }) => {
	const { userData } = useContext(UserDataContext);

	const [path, setPath] = useState(null);

	useEffect(() => {
		setPath(() => {
			if (hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData)) {
				switch (type) {
					case SESSION_LIST_TYPES.ENQUIRY:
						return '/sessions/consultant/sessionPreview';
					case SESSION_LIST_TYPES.TEAMSESSION:
						return '/sessions/consultant/teamSessionView';
					case SESSION_LIST_TYPES.MY_SESSION:
						return '/sessions/consultant/sessionView';
				}
			}
			return '/sessions/user/view';
		});
	}, [type, userData]);

	return (
		<SessionTypeContext.Provider value={{ type, path }}>
			{children}
		</SessionTypeContext.Provider>
	);
};

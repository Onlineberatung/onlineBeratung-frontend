import * as React from 'react';
import { createContext, useMemo } from 'react';
import { ExtendedSessionInterface } from '..';

type ActiveSessionContextProps = {
	activeSession: ExtendedSessionInterface | null;
	reloadActiveSession?: () => void;
	readActiveSession?: () => void;
};

export const ActiveSessionContext =
	createContext<ActiveSessionContextProps>(null);

export const ActiveSessionProvider: React.FC<ActiveSessionContextProps> = ({
	children,
	...params
}) => {
	const contextValue = useMemo(() => params, [params]);

	return (
		<ActiveSessionContext.Provider value={contextValue}>
			{children}
		</ActiveSessionContext.Provider>
	);
};

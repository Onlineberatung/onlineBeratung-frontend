import * as React from 'react';
import { createContext, ReactNode } from 'react';
import { SESSION_LIST_TYPES } from '../../components/session/sessionHelpers';

type SessionTypeProviderProps = {
	type: SESSION_LIST_TYPES;
	children: ReactNode;
};

export const SessionTypeContext =
	createContext<Omit<SessionTypeProviderProps, 'children'>>(null);

export function SessionTypeProvider({
	type,
	children
}: SessionTypeProviderProps) {
	return (
		<SessionTypeContext.Provider value={{ type }}>
			{children}
		</SessionTypeContext.Provider>
	);
}

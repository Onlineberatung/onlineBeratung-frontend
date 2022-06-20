import { createContext } from 'react';
import { ExtendedSessionInterface } from '..';

export const ActiveSessionContext = createContext<{
	activeSession: ExtendedSessionInterface | null;
	reloadActiveSession?: () => void;
}>(null);

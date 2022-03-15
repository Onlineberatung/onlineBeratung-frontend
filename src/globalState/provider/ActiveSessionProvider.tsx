import { createContext } from 'react';
import { ActiveSessionType } from '..';

export const ActiveSessionContext = createContext<ActiveSessionType | null>(
	null
);

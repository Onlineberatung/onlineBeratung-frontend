import { createContext } from 'react';
import { ExtendedSessionInterface } from '..';

export const ActiveSessionContext =
	createContext<ExtendedSessionInterface | null>(null);

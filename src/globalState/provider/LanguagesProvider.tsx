import { createContext } from 'react';

export const LanguagesContext = createContext<{
	fixed: string[];
	spoken: string[];
}>({ fixed: [], spoken: [] });

import { createContext } from 'react';

export type TLocaleContext = {
	locale: string;
	initLocale: string;
	setLocale: (lng: string) => void;
	locales: readonly string[];
	selectableLocales: string[];
};

export const LocaleContext = createContext<TLocaleContext>(null);

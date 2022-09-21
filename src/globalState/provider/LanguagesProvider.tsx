import * as React from 'react';
import { createContext, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppConfig } from '../../hooks/useAppConfig';

export const LanguagesContext = createContext<{
	fixed: string[];
	spoken: string[];
}>({ fixed: [], spoken: [] });

type LanguagesProviderProps = {
	fixed: string[];
	spoken: string[];
	children?: ReactNode;
};

export function LanguagesProvider({
	fixed,
	spoken,
	children
}: LanguagesProviderProps) {
	const { t: translate } = useTranslation();
	const settings = useAppConfig();

	const sortByTranslation = (a, b) => {
		if (translate(`languages.${a}`) === translate(`languages.${b}`)) {
			return 0;
		}
		return translate(`languages.${a}`) > translate(`languages.${b}`)
			? 1
			: -1;
	};

	return (
		<LanguagesContext.Provider
			value={{
				fixed,
				spoken: (spoken ?? settings.spokenLanguages)
					.slice()
					.sort(sortByTranslation)
			}}
		>
			{children}
		</LanguagesContext.Provider>
	);
}

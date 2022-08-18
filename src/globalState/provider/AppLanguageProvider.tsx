import * as React from 'react';
import { createContext, useEffect, useState } from 'react';
import i18n from '../../i18n';

export const AppLanguageContext = createContext<any>(null);

export function AppLanguageProvider(props) {
	const [appLanguage, setAppLanguage] = useState({
		label: '(DE) Deutsch Formell',
		value: 'deFormal',
		short: 'de'
	});

	useEffect(() => {
		if (appLanguage) {
			i18n.changeLanguage(appLanguage.value);
		}
	}, [appLanguage]);

	return (
		<AppLanguageContext.Provider value={{ appLanguage, setAppLanguage }}>
			{props.children}
		</AppLanguageContext.Provider>
	);
}

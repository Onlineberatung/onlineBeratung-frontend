import * as React from 'react';
import { createContext, useEffect, useState } from 'react';
import i18n from '../../i18n';

export const AppLanguageContext = createContext<any>(null);

export function AppLanguageProvider(props) {
	const [appLanguage, setAppLanguage] = useState({
		label: '(DE) Deutsch',
		value: 'deFormal',
		short: 'de'
	});

	const [isInformal, setIsInformal] = useState(false);

	useEffect(() => {
		if (appLanguage) {
			if (appLanguage.short === 'de' && isInformal) {
				i18n.changeLanguage('deInformal');
			} else {
				i18n.changeLanguage(appLanguage.value);
			}
		}
	}, [appLanguage, isInformal]);

	return (
		<AppLanguageContext.Provider
			value={{ appLanguage, setAppLanguage, isInformal, setIsInformal }}
		>
			{props.children}
		</AppLanguageContext.Provider>
	);
}

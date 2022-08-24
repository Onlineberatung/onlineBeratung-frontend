import * as React from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import i18n, { FALLBACK_LNG } from '../../i18n';
import { InformalContext } from './InformalProvider';

const STORAGE_KEY = 'locale';

type TLocaleContext = {
	locale: string;
	setLocale: (lng: string) => void;
	locales: string[];
	selectableLocales: string[];
};

export const LocaleContext = createContext<TLocaleContext>(null);

export function LocaleProvider(props) {
	const [locale, setLocale] = useState('de');
	const { informal } = useContext(InformalContext);
	const locales = useMemo(
		() => Object.keys(i18n.services.resourceStore.data),
		[]
	);
	const selectableLocales = useMemo(
		() =>
			Object.keys(i18n.services.resourceStore.data).filter(
				(lng) => lng.indexOf('_informal') < 0
			),
		[]
	);

	useEffect(() => {
		if (sessionStorage.getItem(STORAGE_KEY)) {
			setLocale(sessionStorage.getItem(STORAGE_KEY));
		}
	}, []);

	useEffect(() => {
		if (locale) {
			let lngCode = `${locale}${informal ? '_informal' : ''}`;
			if (!locales.includes(lngCode)) {
				lngCode = FALLBACK_LNG;
			}
			i18n.changeLanguage(lngCode);
			sessionStorage.setItem(STORAGE_KEY, locale);
		}
	}, [locale, informal, locales]);

	return (
		<LocaleContext.Provider
			value={{
				locale: locale,
				setLocale: setLocale,
				locales: locales,
				selectableLocales: selectableLocales
			}}
		>
			{props.children}
		</LocaleContext.Provider>
	);
}

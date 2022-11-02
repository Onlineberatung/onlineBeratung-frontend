import * as React from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import i18n, { FALLBACK_LNG, init } from '../../i18n';
import { InformalContext } from './InformalProvider';
import { useAppConfig } from '../../hooks/useAppConfig';

export const STORAGE_KEY_LOCALE = 'locale';

type TLocaleContext = {
	locale: string;
	initLocale: string;
	setLocale: (lng: string) => void;
	locales: string[];
	selectableLocales: string[];
};

export const LocaleContext = createContext<TLocaleContext>(null);

export function LocaleProvider(props) {
	const settings = useAppConfig();
	const [initialized, setInitialized] = useState(false);
	const [initLocale, setInitLocale] = useState(null);
	const { informal } = useContext(InformalContext);
	const [locale, setLocale] = useState(null);

	useEffect(() => {
		init(settings.i18n).then(() => {
			setInitLocale(i18n.language);
			if (localStorage.getItem(STORAGE_KEY_LOCALE)) {
				setLocale(localStorage.getItem(STORAGE_KEY_LOCALE));
			} else {
				setLocale(i18n.language || FALLBACK_LNG);
			}
			setInitialized(true);
		});
	}, [settings.i18n]);

	const locales = useMemo(
		() =>
			initialized ? Object.keys(i18n.services.resourceStore.data) : [],
		[initialized]
	);

	const selectableLocales = useMemo(
		() =>
			initialized
				? Object.keys(i18n.services.resourceStore.data).filter(
						(lng) => lng.indexOf('_informal') < 0
				  )
				: [],
		[initialized]
	);

	useEffect(() => {
		if (!initialized) {
			return;
		}

		if (locale) {
			let lngCode = `${locale}${informal ? '_informal' : ''}`;
			if (!locales.includes(lngCode)) {
				// If language is x_informal try if only x exists
				lngCode = locale;
				if (!locales.includes(lngCode)) {
					// else fallback to default lng
					lngCode = FALLBACK_LNG;
				}
			}
			i18n.changeLanguage(lngCode);
			localStorage.setItem(STORAGE_KEY_LOCALE, locale);
			document.documentElement.lang = locale;
		}
	}, [locale, informal, locales, initialized]);

	if (!initialized) {
		return null;
	}

	return (
		<LocaleContext.Provider
			value={{
				locale,
				initLocale,
				setLocale,
				locales,
				selectableLocales
			}}
		>
			{props.children}
		</LocaleContext.Provider>
	);
}

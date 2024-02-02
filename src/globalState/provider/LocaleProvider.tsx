import * as React from 'react';
import { useContext, useEffect, useMemo, useState } from 'react';
import i18n, { FALLBACK_LNG, init } from '../../i18n';
import { InformalContext } from './InformalProvider';
import { useAppConfig } from '../../hooks/useAppConfig';
import { setValueInCookie } from '../../components/sessionCookie/accessSessionCookie';
import { useTenant } from './TenantProvider';
import useTenantTheming from '../../utils/useTenantTheming';
import { LocaleContext, TLocaleContext } from '../context/LocaleContext';

export const STORAGE_KEY_LOCALE = 'locale';

export function LocaleProvider(props) {
	const settings = useAppConfig();
	const isLoading = useTenantTheming();
	const tenant = useTenant();
	const [initialized, setInitialized] = useState(false);
	const [initLocale, setInitLocale] = useState(null);
	const { informal } = useContext(InformalContext);
	const [locales, setLocales] = useState([]);
	const [locale, setLocale] = useState(null);

	useEffect(() => {
		// If using the tenant service we should load first the tenant because we need the
		// active languages from the server to apply it on loading
		if ((settings.useTenantService && isLoading) || initialized) {
			return;
		}

		init(
			{
				...settings.i18n,
				...(tenant?.settings?.activeLanguages && {
					supportedLngs: [
						'de@informal',
						...(tenant?.settings?.activeLanguages || []),
						// If tenant service has 'de' active add default supported languages 'de' and 'de@informal'
						// If 'de' is deactivated 'de@informal' should not be available too
						...(settings.i18n.supportedLngs &&
						(tenant?.settings?.activeLanguages ?? []).includes('de')
							? settings.i18n.supportedLngs
							: [])
					]
				})
			},
			settings.translation
		).then((supportedLanguages) => {
			setLocales(supportedLanguages);
			setInitLocale(i18n.language);
			const locale =
				localStorage.getItem(STORAGE_KEY_LOCALE) ||
				i18n.language ||
				FALLBACK_LNG;

			setValueInCookie('lang', locale);
			setLocale(locale);
			setInitialized(true);
		});
	}, [
		initialized,
		isLoading,
		settings.i18n,
		settings.translation,
		settings.useTenantService,
		tenant?.settings?.activeLanguages
	]);

	const selectableLocales = useMemo(() => {
		return initialized
			? locales.filter((lng) => lng.indexOf('@informal') < 0)
			: [];
	}, [initialized, locales]);

	useEffect(() => {
		if (!initialized) {
			return;
		}

		if (locale) {
			let lngCode = `${locale}${informal ? '@informal' : ''}`;
			if (!locales.includes(lngCode)) {
				// If language is x@informal try if only x exists
				lngCode = locale;
				if (!locales.includes(lngCode)) {
					// else fallback to default lng
					lngCode = FALLBACK_LNG;
				}
			}
			i18n.changeLanguage(lngCode);
			localStorage.setItem(STORAGE_KEY_LOCALE, locale);
			document.documentElement.lang = locale;
			setValueInCookie('lang', locale);
		}
	}, [locale, informal, locales, initialized]);

	const handleOnSetLocale = React.useCallback(
		(lng) => {
			if (locales?.includes?.(lng)) {
				setLocale(lng);
			}
		},
		[locales]
	);

	if (!initialized) {
		return null;
	}

	return (
		<LocaleContext.Provider
			value={{
				locale,
				initLocale,
				setLocale: handleOnSetLocale,
				locales,
				selectableLocales
			}}
		>
			{props.children}
		</LocaleContext.Provider>
	);
}

export const useLocaleData = (): TLocaleContext => {
	return useContext(LocaleContext) || ({} as TLocaleContext);
};

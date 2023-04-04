import * as React from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import i18n, { FALLBACK_LNG, init } from '../../i18n';
import { InformalContext } from './InformalProvider';
import { useAppConfig } from '../../hooks/useAppConfig';
import { setValueInCookie } from '../../components/sessionCookie/accessSessionCookie';
import { useTenant } from './TenantProvider';
import useTenantTheming from '../../utils/useTenantTheming';

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
	const isLoading = useTenantTheming();
	const tenant = useTenant();
	const [initialized, setInitialized] = useState(false);
	const [initLocale, setInitLocale] = useState(null);
	const { informal } = useContext(InformalContext);
	const [locale, setLocale] = useState(null);

	useEffect(() => {
		// If using the tenant service we should load first the tenant because we need the
		// active languages from the server to apply it on loading
		if ((settings.useTenantService && isLoading) || initialized) {
			return;
		}

		init({
			...settings.i18n,
			...(tenant?.settings?.activeLanguages && {
				supportedLngs: [
					'de_informal',
					...(tenant?.settings?.activeLanguages || []),
					// If tenant service has 'de' active add default supported languages 'de' and 'de_informal'
					// If 'de' is deactivated 'de_informal' should not be available too
					...(settings.i18n.supportedLngs &&
					(tenant?.settings?.activeLanguages ?? []).includes('de')
						? settings.i18n.supportedLngs
						: [])
				]
			})
		}).then(() => {
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
		settings.useTenantService,
		tenant?.settings?.activeLanguages
	]);

	const locales = useMemo(
		() =>
			initialized ? Object.keys(i18n.services.resourceStore.data) : [],
		[initialized]
	);

	const selectableLocales = useMemo(() => {
		const resourcesTranslations = initialized
			? Object.keys(i18n.services.resourceStore.data).filter(
					(lng) => lng.indexOf('_informal') < 0
			  )
			: [];

		if (initialized && settings.useTenantService) {
			return tenant?.settings?.activeLanguages || resourcesTranslations;
		}

		return resourcesTranslations;
	}, [
		initialized,
		settings.useTenantService,
		tenant?.settings?.activeLanguages
	]);

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
			setValueInCookie('lang', locale);
		}
	}, [locale, informal, locales, initialized]);

	const handleOnSetLocale = React.useCallback(
		(lng) => {
			if (
				!settings?.i18n?.supportedLngs ||
				(settings.i18n.supportedLngs as string[])?.includes?.(lng)
			) {
				setLocale(lng);
			}
		},
		[settings.i18n.supportedLngs]
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

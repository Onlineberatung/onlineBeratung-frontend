import i18n, { InitOptions, Resource } from 'i18next';
import { initReactI18next } from 'react-i18next';
import ChainedBackend from 'i18next-chained-backend';
import FetchBackend from 'i18next-fetch-backend';
import LocalStorageBackend from 'i18next-localstorage-backend';
import resourcesToBackend from 'i18next-resources-to-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import _ from 'lodash';
import { flatten, unflatten } from 'flat';

import de from './resources/i18n/de/common.json';
import deInformal from './resources/i18n/de@informal/common.json';
import deLanguages from './resources/i18n/de/languages.json';
import {
	STORAGE_KEY_ENABLE_TRANSLATION_CHECK,
	STORAGE_KEY_TRANSLATION_DISABLE_CACHE
} from './components/devToolbar/DevToolbar';
import { TranslationConfig } from './globalState/interfaces';
import { FETCH_METHODS, FETCH_SUCCESS, fetchData } from './api';

export const FALLBACK_LNG = 'de';

const defaultResources = {
	'de': {
		common: {
			...de
		},
		consultingTypes: {},
		agencies: {},
		languages: {
			...deLanguages
		}
	},
	'de@informal': {
		common: {
			...deInformal
		}
	}
};

const translationCacheDisabledLocally =
	localStorage.getItem(STORAGE_KEY_TRANSLATION_DISABLE_CACHE) !== null
		? localStorage.getItem(STORAGE_KEY_TRANSLATION_DISABLE_CACHE) === '1'
		: null;

export const init = async (
	{ resources, supportedLngs, ...config }: InitOptions,
	translation: TranslationConfig
) => {
	let languageResources = {};
	if (translation?.weblate.path) {
		const languagePath = `${translation.weblate.host || ''}${
			translation.weblate.path
		}/projects/${translation.weblate.project}/languages/?format=json`;
		languageResources = await fetchData({
			url: languagePath,
			method: FETCH_METHODS.GET,
			skipAuth: true,
			responseHandling: [FETCH_SUCCESS.CONTENT]
		})
			.then((res) => res.data)
			.then(Object.values)
			.then((res) =>
				res.filter(
					({ translated_percent, code }) =>
						code &&
						(code.indexOf('@informal') !== -1 ||
							parseInt(translated_percent) >
								translation.weblate.percentage)
				)
			)
			.then((res) =>
				res.reduce((acc, { code, name }) => {
					acc[code] = `(${code.toUpperCase()}) ${name}`;
					return acc;
				}, {})
			)
			.then((languages) =>
				Object.keys(languages).reduce((acc, code) => {
					acc[code] = { languages: languages };
					return acc;
				}, {})
			)
			.catch(() => ({}));
	}

	const supportedLanguages = [
		...new Set(
			supportedLngs && supportedLngs.length > 0
				? [...Object.keys(languageResources), ...supportedLngs]
				: ['de', 'de@informal']
		)
	];

	const flattenBaseResource = (resource) => {
		if (!resource) return {};
		return Object.keys(resource).reduce((acc, lng) => {
			acc[lng] = Object.keys(resource[lng]).reduce((acc, ns) => {
				acc[ns] = flatten(resource[lng][ns]);
				return acc;
			}, {});
			return acc;
		}, {});
	};

	const baseResources = _.merge(
		flattenBaseResource(languageResources),
		flattenBaseResource(defaultResources),
		flattenBaseResource(resources)
	);

	return i18n
		.use(ChainedBackend)
		.use(LanguageDetector)
		.use(initReactI18next)
		.init(
			_.merge(
				{
					/*
					 * Do not use localStorage detection because we have to do it
					 * inside LocaleProvider.tsx to detect if language has been
					 * changed by the user
					 */
					ns: ['common', 'consultingTypes', 'agencies', 'languages'],
					supportedLngs: supportedLanguages,
					preload: ['de', 'de@informal'],
					detection: {
						order: ['navigator'],
						caches: []
					},
					defaultNS: 'common',
					fallbackLng: {
						'de@informal': ['de'],
						'default': [FALLBACK_LNG]
					},
					returnEmptyString: true,
					interpolation: {
						escapeValue: false
					},
					partialBundledLanguages: true,
					// ToDo: Temp fix for cypress because it has problems with using backend with cy.clock()
					...((window as any).Cypress
						? {
								resources: unflatten(baseResources) as Resource
							}
						: {}),
					backend: {
						backends: [
							!(
								translationCacheDisabledLocally ??
								translation?.cache?.disabled
							) && LocalStorageBackend,

							translation?.weblate.path && FetchBackend,
							resourcesToBackend(unflatten(baseResources))
						].filter(Boolean),
						backendOptions: [
							!(
								translationCacheDisabledLocally ??
								translation?.cache?.disabled
							) && {
								expirationTime:
									translation?.cache?.time * 60 * 1000
							},
							translation?.weblate.path && {
								// path where resources get loaded from, or a function
								// returning a path:
								// function(lngs, namespaces) { return customPath; }
								// the returned path will interpolate lng, ns if provided like giving a static path
								loadPath: `${translation.weblate.host || ''}${
									translation.weblate.path
								}/translations/${
									translation.weblate.project
								}/{{ns}}/{{lng}}/file.json?format=i18nextv4&q=state%3A%3E%3Dtranslated`,
								// parse data after it has been fetched
								// in example use https://www.npmjs.com/package/json5
								// here it removes the letter a from the json (bad idea)
								parse: (data: string) => {
									const {
										lng,
										ns,
										data: apiData
									} = JSON.parse(data);
									return unflatten(
										_.merge(
											baseResources?.[lng]?.[ns] || {},
											flatten(apiData || {})
										)
									);
								},
								// init option for fetch, for example
								requestOptions: {
									mode: 'cors',
									credentials: 'same-origin',
									cache: 'default',
									headers: {
										...(translation?.weblate.key && {
											Authorization: `Token ${translation?.weblate.key}`
										})
									}
								},

								// define a custom fetch function
								fetch: fetch
							},
							{}
						].filter(Boolean)
					}
				},

				config ?? {}
			),
			() => {
				if ((window as any).Cypress) {
					(window as any).i18n = i18n;
				}

				if (
					(localStorage.getItem(
						STORAGE_KEY_ENABLE_TRANSLATION_CHECK
					) ?? null) === '0' ||
					((localStorage.getItem(
						STORAGE_KEY_ENABLE_TRANSLATION_CHECK
					) ?? null) === null &&
						(!process.env.REACT_APP_ENABLE_TRANSLATION_CHECK ||
							parseInt(
								process.env.REACT_APP_ENABLE_TRANSLATION_CHECK
							) !== 1))
				) {
					return;
				}

				const deLanguage: { [key: string]: string } = flatten(
					i18n.getDataByLanguage(FALLBACK_LNG).common
				);
				const deLanguageKeys = [...Object.keys(deLanguage)].sort(
					(a, b) => a.localeCompare(b)
				);

				const languages = Object.keys(
					i18n.services.resourceStore.data
				).filter((lng) => lng !== FALLBACK_LNG);

				languages.forEach((lng) => {
					const currLanguage: { [key: string]: string } = flatten(
						i18n.getDataByLanguage(lng).common
					);
					const currLanguageKeys = [
						...Object.keys(currLanguage)
					].sort((a, b) => a.localeCompare(b));

					if (lng.indexOf('@informal') >= 0) {
						Object.entries({
							...deLanguage,
							...currLanguage
						}).forEach(([key, text]) => {
							const formalIndex = text.match(
								/( Sie|Sie | Ihr|Ihr )/i
							);
							if (!formalIndex) return;

							if (currLanguageKeys.includes(key)) {
								console.error(
									`[${lng}] has formal language sentence in key "${key}" near "${text.substring(
										formalIndex.index - 25,
										formalIndex.index + 25
									)}"`
								);
								return;
							}
							console.error(
								`[${lng}] has no formal language form for key "${key}" ("${text}")`
							);
						});
					}

					const missingKeys = _.xor(deLanguageKeys, currLanguageKeys);
					if (missingKeys.length <= 0) {
						return;
					}

					missingKeys.forEach((missingKey) => {
						if (!deLanguageKeys.includes(missingKey)) {
							console.error(
								`[${lng}] has key "${missingKey}" but its missing in fallback language "${FALLBACK_LNG}"`
							);
						} else if (lng.indexOf('@informal') < 0) {
							console.error(
								`[${lng}] has missing key "${missingKey}"`
							);
						}
					});
				});
			}
		)
		.then(() => supportedLanguages);
};

export default i18n;

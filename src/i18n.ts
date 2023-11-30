import i18n, { InitOptions } from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import _ from 'lodash';
import flatten from 'flat';

import de from './resources/i18n/de.json';
import deInformal from './resources/i18n/de.informal.json';
import deLanguages from './resources/i18n/de.languages.json';
import { STORAGE_KEY_ENABLE_TRANSLATION_CHECK } from './components/devToolbar/DevToolbar';

export const FALLBACK_LNG = 'de';

const resources = {
	de: {
		common: {
			...de
		},
		consultingTypes: {},
		agencies: {},
		languages: {
			...deLanguages
		}
	},
	de_informal: {
		common: {
			...deInformal
		}
	}
};

export const init = (config: InitOptions) => {
	return i18n
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
					supportedLngs: ['de', 'de_informal'],
					detection: {
						order: ['navigator'],
						caches: []
					},
					defaultNS: 'common',
					fallbackLng: {
						de_informal: ['de'],
						default: [FALLBACK_LNG]
					},
					returnEmptyString: true,
					interpolation: {
						escapeValue: false
					},
					resources
				},
				config ?? {}
			),
			() => {
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

					if (lng.indexOf('_informal') >= 0) {
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
						} else if (lng.indexOf('_informal') < 0) {
							console.error(
								`[${lng}] has missing key "${missingKey}"`
							);
						}
					});
				});
			}
		);
};

export default i18n;

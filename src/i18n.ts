import i18n, { InitOptions } from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import _ from 'lodash';
import flatten from 'flat';

import { de } from './resources/i18n/de';
import { deConsultingTypes } from './resources/i18n/de.consultingTypes';
import { deInformal } from './resources/i18n/de.informal';
import { deAgency } from './resources/i18n/de.agency';
import { deLanguages } from './resources/i18n/de.languages';

export const FALLBACK_LNG = 'de';

const resources = {
	de: {
		common: {
			...de
		},
		consultingTypes: {
			...deConsultingTypes
		},
		agencies: {
			...deAgency
		},
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
					supportedLngs: ['de'],
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
			(err, t) => {
				if (err) {
					return;
				}

				const deLanguage = [
					...Object.keys(
						flatten(i18n.getDataByLanguage(FALLBACK_LNG).common)
					)
				].sort();

				const languages = Object.keys(
					i18n.services.resourceStore.data
				).filter((lng) => lng !== FALLBACK_LNG);

				languages.forEach((lng) => {
					const currLanguage = [
						...Object.keys(
							flatten(i18n.getDataByLanguage(lng).common)
						)
					].sort();
					const missingKeys = _.xor(deLanguage, currLanguage);
					if (missingKeys.length <= 0) {
						return;
					}

					missingKeys.forEach((missingKey) => {
						if (!deLanguage.includes(missingKey)) {
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

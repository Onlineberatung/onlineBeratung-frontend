import i18n, { InitOptions } from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import _ from 'lodash';

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
			)
		);
};

export default i18n;

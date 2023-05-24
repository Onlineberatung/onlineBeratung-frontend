import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

import { de } from '../src/resources/i18n/de';
import { deInformal } from '../src/resources/i18n/de.informal';
import { deLanguages } from '../src/resources/i18n/de.languages';

const ns = ['common'];
const supportedLngs = ['de', 'de_informal', 'en'];
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

i18n.use(initReactI18next)
	.use(LanguageDetector)
	.use(Backend)
	.init({
		//debug: true,
		lng: 'de',
		fallbackLng: 'de',
		defaultNS: 'common',
		ns,
		interpolation: { escapeValue: false },
		react: { useSuspense: false },
		supportedLngs,
		resources
	});

export default i18n;

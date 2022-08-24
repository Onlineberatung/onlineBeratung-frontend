import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { de } from './resources/i18n/de';
import { deConsultingTypes } from './resources/i18n/de.consultingTypes';
import { deInformal } from './resources/i18n/de.informal';
import { deAgency } from './resources/i18n/de.agency';
import { deLanguages } from './resources/i18n/de.languages';
import { config } from './resources/scripts/config';

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

i18n.use(initReactI18next).init({
	defaultNS: 'common',
	fallbackLng: {
		de_informal: ['de'],
		default: [FALLBACK_LNG],
		...config.i18n.fallbackLng
	},
	lng: 'de',
	returnEmptyString: true,
	interpolation: {
		escapeValue: false
	},
	...config.i18n,
	resources: {
		...resources,
		...(config.i18n.resources ? config.i18n.resources : {})
	}
});

export default i18n;

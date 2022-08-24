import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { de } from './resources/i18n/de';
import { deConsultingTypes } from './resources/i18n/de.consultingTypes';
import { deInformal } from './resources/i18n/de.informal';
import { deAgency } from './resources/i18n/de.agency';
import { deLanguages } from './resources/i18n/de.languages';
import { config } from './resources/scripts/config';
import _ from 'lodash';

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

i18n.use(initReactI18next).init(
	_.merge(
		{
			defaultNS: 'common',
			fallbackLng: {
				de_informal: ['de'],
				default: [FALLBACK_LNG]
			},
			lng: 'de',
			returnEmptyString: true,
			interpolation: {
				escapeValue: false
			},
			resources
		},
		config.i18n ?? {}
	)
);

export default i18n;

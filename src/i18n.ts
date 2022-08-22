import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { deFormal } from './resources/i18n/de.formal';
import { deConsultingTypes } from './resources/i18n/de.consultingTypes';
import { deInformal } from './resources/i18n/de.informal';
import { enFormal } from './resources/i18n/en.formal';
import { enInformal } from './resources/i18n/en.informal';
import { enConsultingTypes } from './resources/i18n/en.consultingTypes';
import { deAgency } from './resources/i18n/de.agency';
import { enAgency } from './resources/i18n/en.agency';

const resources = {
	deFormal: {
		translation: {
			...deFormal,
			...deConsultingTypes,
			...deAgency
		}
	},
	deInformal: {
		translation: {
			...deInformal,
			...deConsultingTypes,
			...deAgency
		}
	},
	enFormal: {
		translation: {
			...enFormal,
			...enConsultingTypes,
			...enAgency
		}
	},
	enInformal: {
		translation: {
			...enFormal,
			...enConsultingTypes,
			...enInformal,
			...enAgency
		}
	}
};

i18n.use(initReactI18next).init({
	resources,
	fallbackLng: 'deFormal',
	lng: 'deFormal',
	returnEmptyString: true,
	interpolation: {
		escapeValue: false
	}
});

export default i18n;

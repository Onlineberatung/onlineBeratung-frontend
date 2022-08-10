import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { deFormal } from './resources/i18n/de.formal';
import { deConsultingTypes } from './resources/i18n/de.consultingTypes';
import { deInformal } from './resources/i18n/de.informal';
import { enFormal } from './resources/i18n/en.formal';
import { enInformal } from './resources/i18n/en.informal';
import { enConsultingTypes } from './resources/i18n/en.consultingTypes';

const resources = {
	deFormal: {
		translation: {
			...deFormal,
			...deConsultingTypes
		}
	},
	deInformal: {
		translation: {
			...deInformal,
			...deConsultingTypes
		}
	},
	enFormal: {
		translation: {
			...enFormal,
			...enConsultingTypes
		}
	},
	enInformal: {
		translation: {
			...enFormal,
			...enConsultingTypes,
			...enInformal
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

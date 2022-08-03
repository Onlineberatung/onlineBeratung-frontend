import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { deFormal } from './resources/i18n/de.formal';
import { deInformal } from './resources/i18n/de.informal';
import { enFormal } from './resources/i18n/en.formal';

const fallback = deFormal;

const resources = {
	deFormal: {
		translation: {
			...deFormal
		}
	},
	deInformal: {
		translation: {
			...fallback,
			...deInformal
		}
	},
	enFormal: {
		translation: {
			...fallback,
			...enFormal
		}
	},
	enInformal: {
		translation: {
			...fallback,
			...enFormal
			// ...enInformal // TODO
		}
	}
};

i18n.use(initReactI18next).init({
	resources,
	lng: 'deFormal',
	interpolation: {
		escapeValue: false
	}
});

export default i18n;

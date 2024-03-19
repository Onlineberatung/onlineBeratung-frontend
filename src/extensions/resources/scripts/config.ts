import _ from 'lodash';
import { AppConfigInterface } from '../../../globalState/interfaces';

// Files completely overwritten in extension
import deAgency from '../i18n/de/agency.json';
import deConsultingTypes from '../i18n/de/consultingTypes.json';
import deLanguages from '../i18n/de/languages.json';
import enAgency from '../i18n/en/agency.json';
import enConsultingTypes from '../i18n/en/consultingTypes.json';
import enLanguages from '../i18n/en/languages.json';

// File from main repo
import en from '../../../resources/i18n/en/common.json';

// Files which extends the original languages
import de from '../i18n/overwrites/de/common.json';
import deInformal from '../i18n/overwrites/de@informal/common.json';
import enOverwrite from '../i18n/overwrites/en/common.json';

import { config as baseConfig, uiUrl } from '../../../resources/scripts/config';

export { uiUrl, APP_PATH } from '../../../resources/scripts/config';

export const legalLinks = {
	imprint: '/impressum',
	privacy: '/datenschutz'
};

export const config: AppConfigInterface = {
	..._.merge(baseConfig, {
		urls: {
			chatScheduleUrl: uiUrl + '/registration',
			finishedAnonymousChatRedirect: 'https://www.diakonie.de',
			home: uiUrl + '/registration',
			landingpage: '/registration',
			toEntry: uiUrl + '/registration',
			toRegistration: uiUrl + '/registration',
			...legalLinks
		},
		postcodeFallbackUrl: '{url}{postcode}/',
		twofactor: {
			startObligatoryHint: new Date('2098-07-31'),
			dateTwoFactorObligatory: new Date('2099-02-01')
		}
	}),
	legalLinks: [
		{
			url: legalLinks.imprint,
			label: 'login.legal.infoText.impressum'
		},
		{
			url: legalLinks.privacy,
			label: 'login.legal.infoText.dataprotection',
			registration: true
		}
	],
	i18n: {
		supportedLngs: ['en', 'de'],
		fallbackLng: {
			en: ['de'],
			en_informal: ['en', 'de_informal', 'de']
		},
		resources: {
			de: {
				languages: {
					...deLanguages
				},
				common: {
					...de
				},
				consultingTypes: {
					...deConsultingTypes
				},
				agencies: {
					...deAgency
				}
			},
			de_informal: {
				common: {
					...deInformal
				}
			},
			en: {
				common: [en, enOverwrite],
				consultingTypes: {
					...enConsultingTypes
				},
				agencies: {
					...enAgency
				},
				languages: {
					...enLanguages
				}
			}
		}
	}
};

export const ALIAS_LAST_MESSAGES = {
	E2EE_ACTIVATED: 'aliases.lastMessage.e2ee_activated',
	FURTHER_STEPS: 'aliases.lastMessage.further_steps',
	REASSIGN_CONSULTANT: 'aliases.lastMessage.reassign_consultant',
	REASSIGN_CONSULTANT_RESET_LAST_MESSAGE:
		'aliases.lastMessage.reassign_consultant_reset_last_message'
};

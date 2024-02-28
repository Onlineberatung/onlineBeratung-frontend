import _ from 'lodash';
import de from '../i18n/overwrites/de/common.json';
import deInformal from '../i18n/overwrites/de@informal/common.json';
import en from '../../../resources/i18n/en/common.json';
import enOverwrites from '../i18n/overwrites/en/common.json';
import enLanguages from '../../../resources/i18n/en/languages.json';
import enConsultingTypes from '../i18n/overwrites/en/consultingTypes.json';
import { AppConfigInterface } from '../../../globalState/interfaces';

import { config as baseConfig, uiUrl } from '../../../resources/scripts/config';

export { uiUrl, APP_PATH } from '../../../resources/scripts/config';

export const routePathNames = {
	root: '/',
	login: '/login',
	termsAndConditions: '/nutzungsbedingungen',
	imprint: '/impressum',
	privacy: '/datenschutz'
};

export const config: AppConfigInterface = {
	..._.merge(baseConfig, {
		enableWalkthrough: true, // Feature flag to enable walkthrough
		disableVideoAppointments: true, // Feature flag to enable Video-Termine page
		useTenantService: true,

		urls: {
			chatScheduleUrl: '',
			finishedAnonymousChatRedirect: uiUrl + '/',
			home: uiUrl + '/beratung/registration',
			landingpage: '/beratung/registration',
			registration: uiUrl + '/beratung/registration',
			toEntry: uiUrl + '/login',
			toRegistration: uiUrl + '/beratung/registration'
		},
		postcodeFallbackUrl: null,
		jitsi: {
			enableEncodedTransformSupport: false
		},
		twofactor: {
			startObligatoryHint: new Date('7/26/2222'),
			dateTwoFactorObligatory: new Date('9/30/2222')
		}
	}),
	legalLinks: [
		{
			url: uiUrl + routePathNames.imprint,
			label: 'login.legal.infoText.impressum'
		},
		{
			url: uiUrl + routePathNames.privacy,
			label: 'login.legal.infoText.dataprotection',
			registration: true
		},
		{
			url: routePathNames.termsAndConditions,
			label: 'legal.termsAndConditions.label',
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
					en: '(EN) Englisch'
				},
				common: {
					...de
				},
				consultingTypes: {},
				agencies: {}
			},
			de_informal: {
				common: {
					...deInformal
				},
				consultingTypes: {}
			},
			en: {
				common: [en, enOverwrites],
				consultingTypes: {
					...enConsultingTypes
				},
				agencies: {},
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

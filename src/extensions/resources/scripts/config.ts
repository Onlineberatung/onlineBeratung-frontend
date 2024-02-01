import _ from 'lodash';
import { AppConfigInterface } from '../../../globalState/interfaces';
import de from '../i18n/overwrites/de/common.json';
import deInformal from '../i18n/overwrites/de@informal/common.json';
import deConsultingTypes from '../i18n/overwrites/de/consultingTypes.json';

import { config as baseConfig, uiUrl } from '../../../resources/scripts/config';

export { uiUrl, APP_PATH } from '../../../resources/scripts/config';

/*
 * routes
 */
export const routePathNames = {
	root: '/',
	login: '/login',
	termsAndConditions: '/nutzungsbedingungen',
	imprint: '/impressum',
	privacy: '/datenschutz'
};

export const config: AppConfigInterface = {
	..._.merge(baseConfig, {
		budibaseSSO: true, // Feature flag to enable SSO on budibase
		enableWalkthrough: true, // Feature flag to enable walkthrough
		disableVideoAppointments: true, // Feature flag to enable Video-Termine page
		useTenantService: true,

		urls: {
			chatScheduleUrl: '',
			finishedAnonymousChatRedirect: uiUrl + '/',
			home: uiUrl + '/beratung/registration',
			registration: uiUrl + '/beratung/registration',
			toEntry: uiUrl + '/login',
			toRegistration: uiUrl + '/beratung/registration'
		},
		groupChat: {
			info: {
				showCreator: true,
				showCreationDate: true
			}
		},
		postcodeFallbackUrl: '{url}{postcode}/',
		twofactor: {
			startObligatoryHint: new Date('2222-07-31'),
			dateTwoFactorObligatory: new Date('2222-10-01')
		},
		welcomeScreen: {
			consultingType: {
				hidden: true
			}
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
		}
	],
	i18n: {
		supportedLngs: ['de'],
		resources: {
			de: {
				languages: {
					en: '(EN) Englisch'
				},
				common: {
					...de
				},
				consultingTypes: {
					...deConsultingTypes
				},
				agencies: {}
			},
			de_informal: {
				common: {
					...deInformal
				},
				consultingTypes: {}
			}
		}
	},
	user: {
		profile: {
			visibleOnEnquiry: true
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

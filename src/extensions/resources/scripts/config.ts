import _ from 'lodash';
import enLanguages from '../../../resources/i18n/en/languages.json';
import enConsultingTypes from '../i18n/overwrites/en/consultingTypes.json';
import de from '../i18n/overwrites/de/common.json';
import en from '../i18n/overwrites/en/common.json';
import deInformal from '../i18n/overwrites/de@informal/common.json';
import { AppConfigInterface } from '../../../globalState/interfaces';
import { config as baseConfig, uiUrl } from '../../../resources/scripts/config';

export {
	uiUrl,
	APP_PATH,
	ALIAS_LAST_MESSAGES
} from '../../../resources/scripts/config';

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
		disableVideoAppointments: true, // Feature flag to enable Video-Termine page
		useTenantService: true,
		useApiClusterSettings: true, // Feature flag to enable the cluster use the cluster settings instead of the config file
		mainTenantSubdomainForSingleDomainMultitenancy: 'app',

		urls: {
			chatScheduleUrl: '',
			finishedAnonymousChatRedirect: uiUrl + '/',
			home: uiUrl + '/beratungg/registration',
			lp: '/beratung/registration',
			registration: uiUrl + '/beratung3/registration',
			toEntry: uiUrl + '/login',
			toRegistration: uiUrl + '/beratung4/registration'
		},
		postcodeFallbackUrl: '{url}{postcode}/',
		jitsi: {
			enableEncodedTransformSupport: false
		},
		twofactor: {
			startObligatoryHint: new Date('2222-07-31'),
			dateTwoFactorObligatory: new Date('2222-10-01')
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
				common: {
					...de
				},
				languages: {
					en: '(EN) Englisch'
				}
			},
			de_informal: {
				common: {
					...deInformal
				}
			},
			en: {
				common: {
					...en
				},
				consultingTypes: {
					...enConsultingTypes
				},
				languages: {
					...enLanguages
				}
			}
		}
	}
};

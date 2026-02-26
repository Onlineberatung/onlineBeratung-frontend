import _ from 'lodash';
import de from '../i18n/overwrites/de/common.json';
import deInformal from '../i18n/overwrites/de@informal/common.json';
import deAgency from '../i18n/de/agency.json';
import deConsultingTypes from '../i18n/de/consultingTypes.json';
import en from '../i18n/en/common.json';
import enOverwrites from '../i18n/overwrites/en/common.json';
import enConsultingTypes from '../i18n/en/consultingTypes.json';
import { AppConfigInterface } from '../../globalState/interfaces';
import {
	OVERLAY_RELEASE_NOTE,
	OVERLAY_TWO_FACTOR_NAG
} from '../../globalState/interfaces/AppConfig/OverlaysConfigInterface';

export const uiUrl = window.location.origin;

export const APP_PATH = 'app';

export const routePathNames = {
	root: '/',
	login: '/login',
	termsAndConditions: '/nutzungsbedingungen',
	imprint: '/impressum',
	privacy: '/datenschutz'
};

export const config: AppConfigInterface = {
	enableWalkthrough: true, // Feature flag to enable walkthrough
	multitenancyWithSingleDomainEnabled: false, // Feature flag to enable the multi tenancy with a single domain ex: lands
	useTenantService: true,
	useApiClusterSettings: true, // Feature flag to enable the cluster use the cluster settings instead of the config file
	mainTenantSubdomainForSingleDomainMultitenancy: 'app',
	attachmentEncryption: true, // Feature flag for attachment end to end encryption - e2e must also be enabled in rocket.chat

	requestCollector: {
		limit: 10,
		showCorrelationId: {
			consultant: true,
			user: false,
			other: false
		}
	},
	urls: {
		chatScheduleUrl: '',
		error401: uiUrl + '/error.401.html',
		error404: uiUrl + '/error.404.html',
		error500: uiUrl + '/error.500.html',
		finishedAnonymousChatRedirect: uiUrl + '/',
		home: uiUrl + '/beratung/registration',
		landingpage: '/beratung/registration',
		releases: uiUrl + '/releases',
		redirectToApp: uiUrl + '/' + APP_PATH,
		registration: uiUrl + '/beratung/registration',
		toEntry: uiUrl + '/login',
		toLogin: uiUrl + '/login',
		toRegistration: uiUrl + '/beratung/registration',
		videoCall: '/videoanruf/:domain/:jwt/:video?/:username?/:e2e?'
	},
	groupChat: {
		info: {
			showCreator: false,
			showCreationDate: false
		}
	},
	postcodeFallbackUrl: null,
	jitsi: {
		/**
		 * Enable WebRTC Encoded Transform as an alternative to insertable streams.
		 * NOTE: Currently the only browser supporting this is Safari / WebKit, behind a flag.
		 * This must be enabled in jitsi too. (Config value is named equal)
		 * https://github.com/jitsi/lib-jitsi-meet/blob/afc006e99a42439c305c20faab50a1f786254676/modules/browser/BrowserCapabilities.js#L259
		 */
		enableEncodedTransformSupport: false,
		/**
		 * Enable the e2ee banner outside the jitsi iframe. Set this to true when video-backend is on the latest develop
		 * where the e2ee banner is removed inside jitsi and need to be rendered inside the frontend
		 */
		showE2EEBanner: true,
		showLogo: true
	},
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
	welcomeScreen: {
		consultingType: {
			hidden: false
		}
	},
	emails: {
		notifications: [
			{
				label: 'profile.notifications.follow.up.email.label',
				types: [
					'NEW_CHAT_MESSAGE_FROM_ADVICE_SEEKER'
				]
			}
		]
	},
	overlays: {
		priority: [OVERLAY_RELEASE_NOTE, OVERLAY_TWO_FACTOR_NAG]
	},
	twofactor: {
		startObligatoryHint: new Date('7/26/2222'),
		dateTwoFactorObligatory: new Date('9/30/2222'),
		messages: [
			{
				title: 'twoFactorAuth.nag.obligatory.moment.title',
				copy: 'twoFactorAuth.nag.obligatory.moment.copy',
				showClose: true
			},
			{
				title: 'twoFactorAuth.nag.obligatory.title',
				copy: 'twoFactorAuth.nag.obligatory.copy',
				showClose: false
			}
		]
	},
	spokenLanguages: [
		'de',
		'aa',
		'ab',
		'ae',
		'af',
		'ak',
		'am',
		'an',
		'ar',
		'as',
		'av',
		'ay',
		'az',
		'ba',
		'be',
		'bg',
		'bh',
		'bi',
		'bm',
		'bn',
		'bo',
		'br',
		'bs',
		'ca',
		'ce',
		'ch',
		'co',
		'cr',
		'cs',
		'cu',
		'cv',
		'cy',
		'da',
		'dv',
		'dz',
		'ee',
		'el',
		'en',
		'eo',
		'es',
		'et',
		'eu',
		'fa',
		'ff',
		'fi',
		'fj',
		'fo',
		'fr',
		'fy',
		'ga',
		'gd',
		'gl',
		'gn',
		'gu',
		'gv',
		'ha',
		'he',
		'hi',
		'ho',
		'hr',
		'ht',
		'hu',
		'hy',
		'hz',
		'ia',
		'id',
		'ie',
		'ig',
		'ii',
		'ik',
		'io',
		'is',
		'it',
		'iu',
		'ja',
		'jv',
		'ka',
		'kg',
		'ki',
		'kj',
		'kk',
		'kl',
		'km',
		'kn',
		'ko',
		'kr',
		'ks',
		'ku',
		'kv',
		'kw',
		'ky',
		'la',
		'lb',
		'lg',
		'li',
		'ln',
		'lo',
		'lt',
		'lu',
		'lv',
		'mg',
		'mh',
		'mi',
		'mk',
		'ml',
		'mn',
		'mr',
		'ms',
		'mt',
		'my',
		'na',
		'nb',
		'nd',
		'ne',
		'ng',
		'nl',
		'nn',
		'no',
		'nr',
		'nv',
		'ny',
		'oc',
		'oj',
		'om',
		'or',
		'os',
		'pa',
		'pi',
		'pl',
		'ps',
		'pt',
		'qu',
		'rm',
		'rn',
		'ro',
		'ru',
		'rw',
		'sa',
		'sc',
		'sd',
		'se',
		'sg',
		'si',
		'sk',
		'sl',
		'sm',
		'sn',
		'so',
		'sq',
		'sr',
		'ss',
		'st',
		'su',
		'sv',
		'sw',
		'ta',
		'te',
		'tg',
		'th',
		'ti',
		'tk',
		'tl',
		'tn',
		'to',
		'tr',
		'ts',
		'tt',
		'tw',
		'ty',
		'ug',
		'uk',
		'ur',
		'uz',
		've',
		'vi',
		'vo',
		'wa',
		'wo',
		'xh',
		'yi',
		'yo',
		'za',
		'zh',
		'zu'
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
				},
				consultingTypes: {}
			},
			en: {
				common: _.merge({}, en, enOverwrites),
				consultingTypes: {
					...enConsultingTypes
				},
				agencies: {}
			}
		}
	},
	translation: {
		weblate: {
			host: import.meta.env.FRONTEND_WEBLATE_HOST || '',
			path: import.meta.env.FRONTEND_WEBLATE_PATH || '/p/weblate/api',
			project: import.meta.env.FRONTEND_WEBLATE_PROJECT || 'frontend',
			key: import.meta.env.FRONTEND_WEBLATE_API_KEY || '',
			percentage: parseInt(import.meta.env.FRONTEND_WEBLATE_MIN_PERCENT, 10) || 50
		},
		cache: {
			disabled: import.meta.env.FRONTEND_TRANSLATION_CACHE_DISABLE === '1',
			time: parseInt(import.meta.env.FRONTEND_TRANSLATION_CACHE_TIME, 10) || 120
		}
	},
	user: {
		profile: {
			visibleOnEnquiry: (sessionUserData) =>
				Object.entries(sessionUserData).length !== 0
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

import {
	AppConfigInterface,
	AUTHORITIES,
	hasUserAuthority
} from '../../globalState';
import { ConsultantInformation } from './ConsultantInformation';
import { ConsultantSpokenLanguages } from './ConsultantSpokenLanguages';
import { ConsultantAgencies } from './ConsultantAgencies';
import { AskerConsultingTypeData } from './AskerConsultingTypeData';
import { consultingTypeSelectOptionsSet } from './profileHelpers';
import { AskerRegistration } from './AskerRegistration';
import { ConsultantPrivateData } from './ConsultantPrivateData';
import { AskerAboutMeData } from './AskerAboutMeData';
import { ConsultantStatistics } from './ConsultantStatistics';
import { AbsenceFormular } from './AbsenceFormular';
import { PasswordReset } from '../passwordReset/PasswordReset';
import { TwoFactorAuth } from '../twoFactorAuth/TwoFactorAuth';
import { DeleteAccount } from './DeleteAccount';
import { EnableWalkthrough } from './EnableWalkthrough';
import { Help } from '../help/Help';
import { ConsultantNotifications } from './ConsultantNotifications';
import { COLUMN_LEFT, COLUMN_RIGHT, TabsType } from '../../utils/tabsHelper';
import { Locale } from './Locale';
import { isDesktop } from 'react-device-detect';
import { OverviewBookings } from './OverviewMobile/Bookings';
import { OverviewSessions } from './OverviewMobile/Sessions';

const shouldShowOverview = (useOverviewPage: boolean) =>
	useOverviewPage && !isDesktop;

const profileRoutes = (
	settings: AppConfigInterface,
	selectableLocales: string[]
): TabsType => [
	{
		title: 'profile.routes.general.title',
		url: '/allgemeines',
		elements: [
			{
				condition: () => shouldShowOverview(settings.useOverviewPage),
				title: 'Overview',
				url: '/overview',
				elements: [
					{
						condition: () =>
							shouldShowOverview(settings.useOverviewPage),
						boxed: false,
						component: OverviewSessions
					},
					{
						condition: () =>
							shouldShowOverview(settings.useOverviewPage),
						component: OverviewBookings,
						boxed: false
					}
				]
			},
			{
				title: 'profile.routes.general.public',
				url: '/oeffentlich',
				elements: [
					{
						condition: (userData) =>
							hasUserAuthority(
								AUTHORITIES.CONSULTANT_DEFAULT,
								userData
							),
						component: ConsultantInformation,
						column: COLUMN_LEFT
					},
					{
						condition: (userData) =>
							hasUserAuthority(
								AUTHORITIES.CONSULTANT_DEFAULT,
								userData
							),
						component: ConsultantSpokenLanguages,
						column: COLUMN_RIGHT
					},
					{
						condition: (userData) =>
							hasUserAuthority(
								AUTHORITIES.CONSULTANT_DEFAULT,
								userData
							),
						component: ConsultantAgencies,
						column: COLUMN_LEFT
					},
					{
						condition: (userData) =>
							hasUserAuthority(
								AUTHORITIES.CONSULTANT_DEFAULT,
								userData
							) && settings.enableWalkthrough,
						component: EnableWalkthrough,
						column: COLUMN_LEFT
					},
					{
						condition: (userData) =>
							!hasUserAuthority(
								AUTHORITIES.CONSULTANT_DEFAULT,
								userData
							),
						component: AskerConsultingTypeData,
						boxed: false,
						order: 2,
						column: COLUMN_RIGHT
					},
					{
						condition: (userData, consultingTypes) =>
							!hasUserAuthority(
								AUTHORITIES.CONSULTANT_DEFAULT,
								userData
							) &&
							consultingTypeSelectOptionsSet(
								userData,
								consultingTypes
							).length > 0,
						component: AskerRegistration,
						order: 3,
						column: COLUMN_RIGHT
					}
				]
			},
			{
				title: 'profile.routes.general.privat',
				url: '/privat',
				elements: [
					{
						condition: (userData) =>
							hasUserAuthority(
								AUTHORITIES.CONSULTANT_DEFAULT,
								userData
							),
						component: ConsultantPrivateData,
						column: COLUMN_RIGHT
					},
					{
						condition: (userData) =>
							!hasUserAuthority(
								AUTHORITIES.CONSULTANT_DEFAULT,
								userData
							),
						component: AskerAboutMeData,
						order: 1,
						column: COLUMN_LEFT
					}
				]
			}
		]
	},
	{
		title: 'profile.routes.activities.title',
		url: '/aktivitaeten',
		condition: (userData) =>
			hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData),
		elements: [
			{
				title: 'profile.routes.activities.statistics',
				url: '/statistik',
				elements: [
					{
						component: ConsultantStatistics,
						column: COLUMN_LEFT
					}
				]
			},
			{
				title: 'profile.routes.activities.absence',
				url: '/abwesenheit',
				elements: [
					{
						component: AbsenceFormular,
						column: COLUMN_RIGHT
					}
				]
			}
		]
	},
	{
		title: 'profile.routes.settings.title',
		url: '/einstellungen',
		elements: [
			{
				title: 'profile.routes.settings.security.title',
				url: '/sicherheit',
				elements: [
					{
						component: PasswordReset,
						column: COLUMN_LEFT,
						order: 1
					},
					{
						condition: (userData) =>
							userData.twoFactorAuth?.isEnabled,
						component: TwoFactorAuth,
						column: COLUMN_LEFT
					}
				]
			},
			{
				title: 'profile.routes.notifications.title',
				url: '/email',
				elements: [
					{
						condition: (userData) =>
							hasUserAuthority(
								AUTHORITIES.CONSULTANT_DEFAULT,
								userData
							),
						component: ConsultantNotifications,
						column: COLUMN_RIGHT,
						order: 1
					}
				]
			},
			{
				title: 'profile.routes.display',
				url: '/anzeige',
				elements: [
					{
						condition: () => selectableLocales.length > 1,
						component: Locale,
						column: COLUMN_RIGHT,
						order: 1
					}
				]
			},
			{
				condition: (userData) =>
					hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData),
				component: DeleteAccount,
				boxed: false,
				order: 99,
				fullWidth: true
			}
		]
	},
	{
		title: 'profile.routes.help.title',
		url: '/hilfe',
		elements: [
			{
				title: 'profile.routes.help.videoCall',
				url: '/videoCall',
				elements: [
					{
						component: Help,
						column: COLUMN_LEFT
					}
				]
			}
		]
	}
];

export default profileRoutes;
